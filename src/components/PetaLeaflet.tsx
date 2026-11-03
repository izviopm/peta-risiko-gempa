"use client";

import L from "leaflet";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

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

// Ramp biru ordinal (skill dataviz): terang -> gelap pada mode terang, sebaliknya pada mode gelap.
const RAMP = {
  terang: ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab", "#104281"],
  gelap: ["#184f95", "#256abf", "#3987e5", "#6da7ec", "#b7d3f6"],
};
const KOSONG = { terang: "#e1e0d9", gelap: "#383835" };
const BANDING = {
  terang: { sesuai: "#c3c2b7", terlalu_rendah: "#eb6834", terlalu_tinggi: "#2a78d6" },
  gelap: { sesuai: "#52514e", terlalu_rendah: "#d95926", terlalu_tinggi: "#3987e5" },
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

const MQ = "(prefers-color-scheme: dark)";
function useGelap() {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(MQ);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(MQ).matches,
    () => false,
  );
}

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

  // Peta dibuat sekali.
  useEffect(() => {
    if (!wadah.current || peta.current) return;
    const m = L.map(wadah.current, { zoomSnap: 0.25, minZoom: 3, maxZoom: 10, attributionControl: true }).setView([-2.5, 118], 4.75);
    m.attributionControl.setPrefix(false).addAttribution('Batas wilayah: <a href="https://www.geoboundaries.org">geoBoundaries</a> (CC BY 4.0)');
    peta.current = m;
    return () => {
      m.remove();
      peta.current = null;
    };
  }, []);

  // Gambar ulang poligon saat data, lapis, atau tema berubah.
  useEffect(() => {
    const m = peta.current;
    if (!m || !data || !batas) return;
    const pertama = !lapisGeo.current;
    lapisGeo.current?.remove();
    const tepi = gelap ? "#1a1a19" : "#fcfcfb";
    lapisGeo.current = L.geoJSON(data, {
      style: (ft) => ({ fillColor: warna(ft!.properties as Prop, lapis), fillOpacity: 1, color: tepi, weight: 0.6 }),
      onEachFeature: (ft, ly) => {
        const p = ft.properties as Prop;
        ly.bindTooltip(`<strong>${p.nama}</strong><br>${p.prov}`, { sticky: true });
        ly.on({
          click: () => setPilih(p),
          mouseover: (e) => (e.target as L.Path).setStyle({ weight: 2, color: gelap ? "#f0efec" : "#0b0b0b" }),
          mouseout: (e) => (e.target as L.Path).setStyle({ weight: 0.6, color: tepi }),
        });
      },
    }).addTo(m);
    if (pertama) m.fitBounds(lapisGeo.current.getBounds(), { padding: [8, 8] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, batas, lapis, gelap]);

  const fokus = (key: string) => {
    if (!lapisGeo.current) return;
    lapisGeo.current.eachLayer((ly) => {
      const ft = (ly as L.GeoJSON).feature as GeoJSON.Feature<GeoJSON.Geometry, Prop>;
      if (ft.properties.key === key) {
        peta.current?.fitBounds((ly as L.Polygon).getBounds(), { maxZoom: 8 });
        setPilih(ft.properties);
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
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <label className="form-control">
              <span className="mb-1 block text-sm text-base-content/70">Lapisan peta</span>
              <select className="select select-sm w-72 max-w-full" value={lapis} onChange={(e) => setLapis(e.target.value as Lapis)}>
                {Object.entries(LAPIS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control">
              <span className="mb-1 block text-sm text-base-content/70">Cari kabupaten/kota</span>
              <input
                className="input input-sm w-64 max-w-full"
                list="daftar-kab"
                placeholder="mis. Cianjur"
                onChange={(e) => {
                  const k = daftar.find((p) => p.nama === e.target.value);
                  if (k) fokus(k.key);
                }}
              />
              <datalist id="daftar-kab">
                {data?.features.map((x) => <option key={x.properties.key} value={x.properties.nama} />)}
              </datalist>
            </label>
          </div>

          <div className="relative overflow-hidden rounded-box border border-base-300">
            <div ref={wadah} className="h-[460px] w-full sm:h-[560px]" role="region" aria-label={`Peta: ${info.label}`} />
            {!data && !galat && <div className="absolute inset-0 grid place-items-center text-sm text-base-content/60">Memuat peta…</div>}
            {galat && <div className="absolute inset-0 grid place-items-center text-sm text-error">Gagal memuat data peta.</div>}
          </div>

          <Legenda lapis={lapis} mode={mode} />
        </div>

        <aside className="rounded-box border border-base-300 p-5" aria-live="polite">
          {pilih ? <Detail p={pilih} /> : <p className="text-sm text-base-content/70">Klik salah satu kabupaten/kota di peta, atau cari namanya, untuk melihat rinciannya.</p>}
        </aside>
      </div>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Tabel kabupaten/kota</h2>
          <input className="input input-sm w-64" placeholder="Saring nama atau provinsi" value={cari} onChange={(e) => setCari(e.target.value)} aria-label="Saring tabel" />
        </div>
        <p className="mt-1 text-sm text-base-content/60">Diurutkan menurut EAD. {daftar.length} baris.</p>
        <div className="mt-3 max-h-[480px] overflow-auto rounded-box border border-base-300">
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
    ["EAD (rumah ekuivalen hancur total/tahun)", id(p.ead!, 2)],
    ["Kuintil indeks usulan", `${p.kelas} dari 5`],
    ["Zona tarif gempa OJK 2017", `${ROMAWI[p.ojk_zona ?? 0]}${p.ojk_imputasi ? " (zona kabupaten induk)" : ""}`],
    ["Skor IRBI 2024 gempa", p.irbi == null ? "–" : `${id(p.irbi, 2)} (${p.irbi_kelas?.toLowerCase()})`],
    ["Zona SKATER / K-Means", `${p.skater} / ${p.kmeans}`],
    ["Kerusakan aktual 2020–2026", `${id(p.aktual ?? 0, 2)} rumah ekuivalen`],
    ["Penduduk (turunan BPS)", id(p.penduduk ?? 0)],
    ["Penduduk miskin (P0)", `${id(p.p0 ?? 0, 2)}%`],
  ];
  return (
    <div>
      <h2 className="text-lg font-semibold">{p.nama}</h2>
      <p className="text-sm text-base-content/60">{p.prov}</p>
      <dl className="mt-4 space-y-3 text-sm">
        {baris.map(([k, v]) => (
          <div key={k}>
            <dt className="text-base-content/60">{k}</dt>
            <dd className="font-medium tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      {p.ojk_banding && p.ojk_banding !== "sesuai" && (
        <p className="mt-4 rounded-box bg-base-200 p-3 text-xs text-base-content/75">
          {p.ojk_banding === "terlalu_tinggi"
            ? "Zona OJK lebih tinggi dari kuintil indeks. Ini menandai kabupaten yang layak ditinjau, bukan bukti tarif terlalu tinggi: indeks hanya merekam guncangan merusak 1973–2019."
            : "Zona OJK lebih rendah dari kuintil indeks. Ini sinyal untuk ditinjau, bukan bukti salah zona."}
        </p>
      )}
    </div>
  );
}
