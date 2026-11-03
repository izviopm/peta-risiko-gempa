"use client";

import L from "leaflet";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGelap } from "@/lib/tema";

type Prop = {
  key: string;
  nama: string;
  prov: string;
  ead: number | null;
  kelas: number | null;
  irbi: number | null;
  irbi_kelas: string | null;
  ojk_zona: number | null;
  ojk_imputasi: boolean;
  ojk_banding: "sesuai" | "terlalu_rendah" | "terlalu_tinggi" | null;
  skater: number | null;
  kmeans: number | null;
  aktual: number | null;
  penduduk: number | null;
  p0: number | null;
};
type FC = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon | GeoJSON.Polygon, Prop>;

// Ramp biru ai ordinal (dari token primary): terang -> gelap pada mode terang, sebaliknya pada mode gelap.
const RAMP = {
  terang: ["#bcd5ec", "#7fa9d3", "#4a7fb5", "#2f5d8c", "#183754"],
  gelap: ["#1f3a57", "#2f5d8c", "#4f86bd", "#8db4dc", "#d3e4f4"],
};
const KOSONG = { terang: "#e2e8f0", gelap: "#2a3a4d" };
const TEPI = { terang: "#ffffff", gelap: "#172230" };
const BANDING = {
  terang: { sesuai: "#cbd5e1", terlalu_rendah: "#c2410c", terlalu_tinggi: "#2f5d8c" },
  gelap: { sesuai: "#3a4d63", terlalu_rendah: "#f9b77a", terlalu_tinggi: "#8db4dc" },
};

const LAPIS = {
  kelas: { label: "Indeks usulan (kuintil EAD)", kiri: "rendah", kanan: "tinggi" },
  ojk_zona: { label: "Zona tarif gempa OJK 2017 (I–V)", kiri: "Zona I", kanan: "Zona V" },
  irbi: { label: "IRBI 2024 gempa (kuintil skor)", kiri: "rendah", kanan: "tinggi" },
  aktual: { label: "Kerusakan aktual 2020–2026 (kuintil)", kiri: "sedikit", kanan: "banyak" },
  skater: { label: "Zonasi SKATER k = 5 (kontigu)", kiri: "zona 1", kanan: "zona 5" },
  kmeans: { label: "Zonasi K-Means k = 5", kiri: "zona 1", kanan: "zona 5" },
  ojk_banding: { label: "Kesesuaian indeks dengan zona OJK", kiri: "", kanan: "" },
} as const;
type Lapis = keyof typeof LAPIS;

const ROMAWI = ["", "I", "II", "III", "IV", "V"];
const id = (n: number, d = 0) => n.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Batas kuintil dari nilai (mengabaikan null). */
function kuintil(nilai: number[]) {
  const s = [...nilai].sort((a, b) => a - b);
  return [0.2, 0.4, 0.6, 0.8].map((q) => s[Math.floor(q * (s.length - 1))]);
}
const kelasDari = (v: number, batas: number[]) => 1 + batas.filter((b) => v > b).length;


export default function PetaLeaflet() {
  const wadah = useRef<HTMLDivElement>(null);
  const peta = useRef<L.Map | null>(null);
  const lapisGeo = useRef<L.GeoJSON | null>(null);
  const [data, setData] = useState<FC | null>(null);
  const [galat, setGalat] = useState(false);
  const [lapis, setLapis] = useState<Lapis>("kelas");
  const [pilih, setPilih] = useState<Prop | null>(null);
  const [cari, setCari] = useState("");
  const gelap = useGelap();
  const mode = gelap ? "gelap" : "terang";

  useEffect(() => {
    fetch("/data/kabupaten.geojson")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setData)
      .catch(() => setGalat(true));
  }, []);

  const batas = useMemo(() => {
    if (!data) return null;
    const ps = data.features.map((x) => x.properties);
    return {
      irbi: kuintil(ps.flatMap((p) => (p.irbi == null || p.kelas == null ? [] : [p.irbi]))),
      aktual: kuintil(ps.flatMap((p) => (p.aktual ? [p.aktual] : []))),
    };
  }, [data]);

  /** Kelas 1..5, 0 = kosong/nol, atau kategori kesesuaian OJK. */
  const nilaiKelas = (p: Prop, l: Lapis): number | string | null => {
    if (p.kelas == null) return null; // Samosir & Toba Samosir tidak diindeks
    switch (l) {
      case "irbi":
        return p.irbi == null ? null : kelasDari(p.irbi, batas!.irbi);
      case "aktual":
        return p.aktual ? kelasDari(p.aktual, batas!.aktual) : 0;
      case "ojk_banding":
        return p.ojk_banding;
      default:
        return p[l];
    }
  };

  const warna = (p: Prop, l: Lapis) => {
    const k = nilaiKelas(p, l);
    if (k == null || k === 0) return KOSONG[mode];
    if (typeof k === "string") return BANDING[mode][k as keyof (typeof BANDING)["terang"]];
    return RAMP[mode][k - 1];
  };

  // Gaya dibaca lewat ref agar layer cukup dibuat sekali; ganti lapisan/tema hanya memanggil setStyle.
  const terpilih = useRef<string | null>(null);
  const gaya = useRef<(p: Prop) => L.PathOptions>(() => ({}));
  const sorot = gelap ? "#f9b77a" : "#1e293b";
  const warnaSorot = useRef(sorot);
  // Diperbarui setelah render (effect pertama, jadi selalu jalan sebelum effect lain di bawah).
  useEffect(() => {
    warnaSorot.current = sorot;
    gaya.current = (p) => {
      const aktif = terpilih.current === p.key;
      return { fillColor: warna(p, lapis), fillOpacity: 1, color: aktif ? sorot : TEPI[mode], weight: aktif ? 2.5 : 0.6 };
    };
  });

  // Peta dibuat sekali. Renderer canvas jauh lebih ringan daripada SVG untuk 514 poligon detail.
  useEffect(() => {
    if (!wadah.current || peta.current) return;
    const m = L.map(wadah.current, {
      preferCanvas: true,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 120,
      minZoom: 3,
      maxZoom: 10,
      scrollWheelZoom: false, // aktif setelah peta diklik, agar scroll halaman tidak tersangkut di peta
      fadeAnimation: true,
      zoomAnimation: true,
    }).setView([-2.5, 118], 4.75);
    m.attributionControl.setPrefix(false).addAttribution('Batas wilayah: <a href="https://www.geoboundaries.org">geoBoundaries</a> (CC BY 4.0)');
    m.on("click focus", () => m.scrollWheelZoom.enable());
    m.on("mouseout blur", () => m.scrollWheelZoom.disable());
    peta.current = m;
    // Ukuran wadah bisa berubah setelah peta dibuat (font, layout); sesuaikan ulang selama pengguna belum menggeser.
    let digeser = false;
    m.on("dragstart", () => (digeser = true));
    const ro = new ResizeObserver(() => {
      m.invalidateSize();
      if (!digeser && lapisGeo.current) m.fitBounds(lapisGeo.current.getBounds(), { padding: [8, 8], animate: false });
    });
    ro.observe(wadah.current);
    return () => {
      ro.disconnect();
      m.remove();
      peta.current = null;
    };
  }, []);

  // Layer poligon dibuat sekali saat data siap.
  useEffect(() => {
    const m = peta.current;
    if (!m || !data || !batas || lapisGeo.current) return;
    lapisGeo.current = L.geoJSON(data, {
      style: (ft) => gaya.current(ft!.properties as Prop),
      onEachFeature: (ft, ly) => {
        const p = ft.properties as Prop;
        ly.bindTooltip(`<strong>${p.nama}</strong><br>${p.prov}`, { sticky: true, direction: "top", offset: [0, -8] });
        ly.on({
          click: () => {
            terpilih.current = p.key;
            setPilih(p);
            lapisGeo.current?.setStyle((f) => gaya.current(f!.properties as Prop));
          },
          mouseover: (e) => {
            const l = e.target as L.Path;
            l.setStyle({ weight: 2, color: warnaSorot.current });
            l.bringToFront();
          },
          mouseout: (e) => (e.target as L.Path).setStyle(gaya.current(p)),
        });
      },
    }).addTo(m);
    m.fitBounds(lapisGeo.current.getBounds(), { padding: [8, 8], animate: false });
  }, [data, batas]);

  // Ganti lapisan atau tema: cukup warnai ulang.
  useEffect(() => {
    lapisGeo.current?.setStyle((f) => gaya.current(f!.properties as Prop));
  }, [lapis, gelap, batas]);

  const fokus = (key: string) => {
    if (!lapisGeo.current) return;
    lapisGeo.current.eachLayer((ly) => {
      const ft = (ly as L.GeoJSON).feature as GeoJSON.Feature<GeoJSON.Geometry, Prop>;
      if (ft.properties.key === key) {
        terpilih.current = key;
        setPilih(ft.properties);
        lapisGeo.current?.setStyle((f) => gaya.current(f!.properties as Prop));
        peta.current?.flyToBounds((ly as L.Polygon).getBounds(), { maxZoom: 8, duration: 0.8, padding: [24, 24] });
      }
    });
  };

  const daftar = useMemo(() => {
    if (!data) return [];
    const q = cari.trim().toLowerCase();
    return data.features
      .map((x) => x.properties)
      .filter((p) => p.kelas != null && (!q || p.nama.toLowerCase().includes(q) || p.prov.toLowerCase().includes(q)))
      .sort((a, b) => (b.ead ?? 0) - (a.ead ?? 0));
  }, [data, cari]);

  const info = LAPIS[lapis];

  return (
    <div className="space-y-4">
      <div className="kartu p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-base-content/70">Lapisan peta</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(LAPIS) as Lapis[]).map((k) => (
                <motion.button
                  key={k}
                  type="button"
                  aria-pressed={lapis === k}
                  onClick={() => setLapis(k)}
                  whileTap={{ scale: 0.96 }}
                  className={`relative min-h-10 cursor-pointer rounded-full border px-4 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    lapis === k ? "border-primary font-medium text-primary-content" : "border-base-300 bg-base-100 hover:border-primary/50"
                  }`}
                >
                  {lapis === k && (
                    <motion.span layoutId="lapis-aktif" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} aria-hidden />
                  )}
                  <span className="relative">{LAPIS[k].label}</span>
                </motion.button>
              ))}
            </div>
          </fieldset>
          <label className="w-full shrink-0 lg:w-72">
            <span className="mb-2 block text-sm font-medium text-base-content/70">Cari kabupaten/kota</span>
            <span className="input w-full rounded-full">
              <Search className="size-4 opacity-60" aria-hidden />
              <input
                list="daftar-kab"
                placeholder="mis. Cianjur"
                onChange={(e) => {
                  const k = daftar.find((p) => p.nama === e.target.value);
                  if (k) fokus(k.key);
                }}
              />
            </span>
            <datalist id="daftar-kab">
              {data?.features.map((x) => <option key={x.properties.key} value={x.properties.nama} />)}
            </datalist>
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="kartu overflow-hidden p-2">
          <div className="relative overflow-hidden rounded-[1.25rem]">
            <div ref={wadah} data-lenis-prevent className="h-[460px] w-full sm:h-[600px]" role="region" aria-label={`Peta: ${info.label}`} />
            {!data && !galat && <div className="absolute inset-0 grid place-items-center text-sm text-base-content/60">Memuat peta…</div>}
            {galat && <div className="absolute inset-0 grid place-items-center text-sm text-error">Gagal memuat data peta.</div>}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={lapis} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <Legenda lapis={lapis} mode={mode} />
              </motion.div>
            </AnimatePresence>
            <p className="text-xs text-base-content/60">Klik peta untuk zoom dengan scroll · geser untuk berpindah</p>
          </div>
        </div>

        <aside className="kartu p-6" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pilih?.key ?? "kosong"}
              className="h-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {pilih ? (
                <Detail p={pilih} />
              ) : (
                <div className="grid h-full min-h-48 place-items-center text-center">
                  <p className="max-w-56 text-sm text-base-content/65">Klik salah satu kabupaten/kota di peta, atau cari namanya, untuk melihat rinciannya.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>

      <section className="kartu p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Tabel kabupaten/kota</h2>
            <p className="mt-1 text-sm text-base-content/60">Diurutkan menurut EAD. {daftar.length} baris. Klik baris untuk melihat di peta.</p>
          </div>
          <label className="input w-full rounded-full sm:w-64">
            <Search className="size-4 opacity-60" aria-hidden />
            <input placeholder="Saring nama atau provinsi" value={cari} onChange={(e) => setCari(e.target.value)} aria-label="Saring tabel" />
          </label>
        </div>
        <div data-lenis-prevent className="mt-4 max-h-[480px] overflow-auto overscroll-contain rounded-[1.25rem] border border-base-300">
          <table className="table table-pin-rows table-sm">
            <thead>
              <tr>
                <th>Kabupaten/kota</th>
                <th>Provinsi</th>
                <th className="text-right">EAD</th>
                <th className="text-right">Kuintil</th>
                <th className="text-right">Zona OJK</th>
                <th className="text-right">IRBI</th>
                <th className="text-right">Rusak 2020–26</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {daftar.map((p) => (
                <tr key={p.key} className="hover:bg-base-200 cursor-pointer" onClick={() => fokus(p.key)}>
                  <td>{p.nama}</td>
                  <td>{p.prov}</td>
                  <td className="text-right">{id(p.ead!, 1)}</td>
                  <td className="text-right">{p.kelas}</td>
                  <td className="text-right">{ROMAWI[p.ojk_zona ?? 0]}</td>
                  <td className="text-right">{p.irbi == null ? "–" : id(p.irbi, 2)}</td>
                  <td className="text-right">{id(p.aktual ?? 0, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Legenda({ lapis, mode }: { lapis: Lapis; mode: "terang" | "gelap" }) {
  const info = LAPIS[lapis];
  const kotak = (c: string) => <span className="inline-block h-3 w-5 rounded-sm" style={{ background: c }} aria-hidden />;
  if (lapis === "ojk_banding") {
    const b = BANDING[mode];
    return (
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2">{kotak(b.sesuai)}Sesuai / selisih kecil</span>
        <span className="flex items-center gap-2">{kotak(b.terlalu_rendah)}Zona OJK ≤ II, indeks kuintil 4–5</span>
        <span className="flex items-center gap-2">{kotak(b.terlalu_tinggi)}Zona OJK ≥ IV, indeks kuintil 1–2</span>
        <span className="flex items-center gap-2">{kotak(KOSONG[mode])}Tidak diindeks</span>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <span className="font-medium">{info.label}</span>
      <span className="flex items-center gap-1">
        <span className="text-base-content/60">{info.kiri}</span>
        {RAMP[mode].map((c) => (
          <span key={c}>{kotak(c)}</span>
        ))}
        <span className="text-base-content/60">{info.kanan}</span>
      </span>
      <span className="flex items-center gap-2">
        {kotak(KOSONG[mode])}
        {lapis === "aktual" ? "Tidak ada kerusakan tercatat" : "Tidak diindeks"}
      </span>
    </div>
  );
}

function Detail({ p }: { p: Prop }) {
  if (p.kelas == null)
    return (
      <div>
        <h2 className="text-lg font-semibold">{p.nama}</h2>
        <p className="text-sm text-base-content/60">{p.prov}</p>
        <p className="mt-3 text-sm">Tidak diindeks: tabel IRBI 2024 mencantumkan &quot;Toba Samosir&quot; dua kali sehingga Samosir dan Toba Samosir tidak dapat dibedakan.</p>
      </div>
    );
  const baris: [string, string][] = [
    ["Zona tarif gempa OJK 2017", `${ROMAWI[p.ojk_zona ?? 0]}${p.ojk_imputasi ? " (zona kabupaten induk)" : ""}`],
    ["Skor IRBI 2024 gempa", p.irbi == null ? "–" : `${id(p.irbi, 2)} (${p.irbi_kelas?.toLowerCase()})`],
    ["Zona SKATER / K-Means", `${p.skater} / ${p.kmeans}`],
    ["Kerusakan aktual 2020–2026", `${id(p.aktual ?? 0, 2)} rumah ekuivalen`],
    ["Penduduk (turunan BPS)", id(p.penduduk ?? 0)],
    ["Penduduk miskin (P0)", `${id(p.p0 ?? 0, 2)}%`],
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold">{p.nama}</h2>
      <p className="text-sm text-base-content/60">{p.prov}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-[1.25rem] bg-primary p-4 text-primary-content">
          <p className="text-xs opacity-85">EAD / tahun</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{id(p.ead!, 1)}</p>
          <p className="text-xs opacity-85">rumah ekuivalen</p>
        </div>
        <div className="rounded-[1.25rem] bg-base-200 p-4">
          <p className="text-xs text-base-content/65">Kuintil indeks</p>
          <p className="mt-1 text-2xl font-semibold">{p.kelas}<span className="text-base font-normal text-base-content/60"> / 5</span></p>
          <p className="text-xs text-base-content/65">{p.kelas! >= 4 ? "tinggi" : p.kelas! <= 2 ? "rendah" : "sedang"}</p>
        </div>
      </div>
      <dl className="mt-5 space-y-3 text-sm">
        {baris.map(([k, v]) => (
          <div key={k}>
            <dt className="text-base-content/60">{k}</dt>
            <dd className="font-medium tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      {p.ojk_banding && p.ojk_banding !== "sesuai" && (
        <p className="mt-4 rounded-[1.25rem] bg-warning p-4 text-xs text-warning-content">
          {p.ojk_banding === "terlalu_tinggi"
            ? "Zona OJK lebih tinggi dari kuintil indeks. Ini menandai kabupaten yang layak ditinjau, bukan bukti tarif terlalu tinggi: indeks hanya merekam guncangan merusak 1973–2019."
            : "Zona OJK lebih rendah dari kuintil indeks. Ini sinyal untuk ditinjau, bukan bukti salah zona."}
        </p>
      )}
    </div>
  );
}
