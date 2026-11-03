"use client";

import L from "leaflet";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { f, type Lang } from "@/lib/i18n";
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
type Mode = "terang" | "gelap";

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

const LAPIS_KUNCI = ["kelas", "ojk_zona", "irbi", "aktual", "skater", "kmeans", "ojk_banding"] as const;
type Lapis = (typeof LAPIS_KUNCI)[number];

const T = {
  id: {
    lapisan: "Lapisan peta",
    lapis: {
      kelas: { label: "Indeks kami (kelas 1–5)", kiri: "rendah", kanan: "tinggi" },
      ojk_zona: { label: "Zona tarif gempa OJK (I–V)", kiri: "Zona I", kanan: "Zona V" },
      irbi: { label: "IRBI 2024 (kelas 1–5)", kiri: "rendah", kanan: "tinggi" },
      aktual: { label: "Rumah rusak 2020–2026", kiri: "sedikit", kanan: "banyak" },
      skater: { label: "Zona menyambung (SKATER)", kiri: "zona 1", kanan: "zona 5" },
      kmeans: { label: "Zona bebas (K-Means)", kiri: "zona 1", kanan: "zona 5" },
      ojk_banding: { label: "Beda dengan zona OJK", kiri: "", kanan: "" },
    },
    kelasCatatan: "Kelas 1–5: 512 daerah diurutkan menurut skor lalu dibagi lima kelompok sama besar.",
    cari: "Cari kabupaten/kota",
    contoh: "contoh: Cianjur",
    petunjuk: "Klik peta lalu scroll untuk zoom · seret untuk menggeser",
    memuat: "Memuat peta…",
    gagal: "Peta gagal dimuat. Coba muat ulang halaman.",
    kosong: "Klik salah satu kabupaten/kota di peta, atau cari namanya, untuk melihat rinciannya.",
    tidakDinilai: "Tidak dinilai",
    belumRusak: "Belum ada rumah rusak tercatat",
    sejalan: "Sejalan",
    ojkRendah: "Zona OJK rendah (I–II), skor kami tinggi",
    ojkTinggi: "Zona OJK tinggi (IV–V), skor kami rendah",
    tabel: "Tabel kabupaten/kota",
    tabelKet: (n: number) => `Diurutkan dari perkiraan kerusakan tertinggi. ${n} baris. Klik baris untuk melihatnya di peta.`,
    saring: "Saring nama atau provinsi",
    kol: ["Kabupaten/kota", "Provinsi", "Kerusakan/tahun", "Kelas", "Zona OJK", "IRBI", "Rusak 2020–26"],
    samosir: "Tidak dinilai: tabel IRBI 2024 menulis \"Toba Samosir\" dua kali sehingga Samosir dan Toba Samosir tidak bisa dibedakan.",
    ead: "Perkiraan kerusakan per tahun",
    eadSat: "setara rumah hancur",
    kelasRisiko: "Kelas risiko",
    tingkat: ["", "rendah", "rendah", "sedang", "tinggi", "tinggi"],
    ojk: "Zona tarif gempa OJK 2017",
    induk: " (mengikuti kabupaten induk)",
    irbi: "Skor IRBI 2024",
    irbiKelas: { RENDAH: "rendah", SEDANG: "sedang", TINGGI: "tinggi" } as Record<string, string>,
    zona: "Zona SKATER / K-Means",
    rusak: "Rumah rusak 2020–2026",
    rusakSat: "setara rumah hancur",
    penduduk: "Penduduk (perkiraan dari data BPS)",
    miskin: "Penduduk miskin",
    catatanTinggi:
      "Zona OJK di sini lebih tinggi dari kelas risiko kami. Ini tanda untuk ditinjau, bukan bukti tarifnya terlalu tinggi: skor kami hanya merekam guncangan merusak 1973–2019.",
    catatanRendah: "Zona OJK di sini lebih rendah dari kelas risiko kami. Ini tanda untuk ditinjau, bukan bukti zonanya salah.",
    aria: (l: string) => `Peta: ${l}`,
  },
  en: {
    lapisan: "Map layer",
    lapis: {
      kelas: { label: "Our index (class 1-5)", kiri: "low", kanan: "high" },
      ojk_zona: { label: "OJK earthquake tariff zone (I-V)", kiri: "Zone I", kanan: "Zone V" },
      irbi: { label: "IRBI 2024 (class 1-5)", kiri: "low", kanan: "high" },
      aktual: { label: "Damaged houses 2020-2026", kiri: "few", kanan: "many" },
      skater: { label: "Connected zones (SKATER)", kiri: "zone 1", kanan: "zone 5" },
      kmeans: { label: "Free zones (K-Means)", kiri: "zone 1", kanan: "zone 5" },
      ojk_banding: { label: "Difference from OJK zones", kiri: "", kanan: "" },
    },
    kelasCatatan: "Class 1-5: the 512 districts are sorted by score and split into five equal groups.",
    cari: "Find a district",
    contoh: "e.g. Cianjur",
    petunjuk: "Click the map, then scroll to zoom · drag to pan",
    memuat: "Loading map…",
    gagal: "The map failed to load. Try reloading the page.",
    kosong: "Click a district on the map, or search for it, to see its details.",
    tidakDinilai: "Not scored",
    belumRusak: "No damaged houses recorded",
    sejalan: "In line",
    ojkRendah: "Low OJK zone (I-II), high score in our index",
    ojkTinggi: "High OJK zone (IV-V), low score in our index",
    tabel: "District table",
    tabelKet: (n: number) => `Sorted by estimated damage, highest first. ${n} rows. Click a row to show it on the map.`,
    saring: "Filter by name or province",
    kol: ["District", "Province", "Damage/year", "Class", "OJK zone", "IRBI", "Damaged 2020-26"],
    samosir: "Not scored: the IRBI 2024 table lists \"Toba Samosir\" twice, so Samosir and Toba Samosir cannot be told apart.",
    ead: "Estimated damage per year",
    eadSat: "destroyed-house equivalents",
    kelasRisiko: "Risk class",
    tingkat: ["", "low", "low", "medium", "high", "high"],
    ojk: "OJK 2017 earthquake tariff zone",
    induk: " (taken from the parent district)",
    irbi: "IRBI 2024 score",
    irbiKelas: { RENDAH: "low", SEDANG: "medium", TINGGI: "high" } as Record<string, string>,
    zona: "SKATER / K-Means zone",
    rusak: "Damaged houses 2020-2026",
    rusakSat: "destroyed-house equivalents",
    penduduk: "Population (estimated from BPS data)",
    miskin: "Share of population in poverty",
    catatanTinggi:
      "The OJK zone here is higher than our risk class. Treat this as a prompt for review. It does not show that the rate is too high, because our score only covers damaging shaking from 1973 to 2019.",
    catatanRendah: "The OJK zone here is lower than our risk class. Treat this as a prompt for review. It does not show that the zone is wrong.",
    aria: (l: string) => `Map: ${l}`,
  },
};

const ROMAWI = ["", "I", "II", "III", "IV", "V"];

/** Batas kuintil dari nilai (mengabaikan null). */
function kuintil(nilai: number[]) {
  const s = [...nilai].sort((a, b) => a - b);
  return [0.2, 0.4, 0.6, 0.8].map((q) => s[Math.floor(q * (s.length - 1))]);
}
const kelasDari = (v: number, batas: number[]) => 1 + batas.filter((b) => v > b).length;

export default function PetaLeaflet({ lang }: { lang: Lang }) {
  const t = T[lang];
  const n = (x: number, d = 0) => f(x, d, lang);
  const wadah = useRef<HTMLDivElement>(null);
  const peta = useRef<L.Map | null>(null);
  const lapisGeo = useRef<L.GeoJSON | null>(null);
  const [data, setData] = useState<FC | null>(null);
  const [galat, setGalat] = useState(false);
  const [lapis, setLapis] = useState<Lapis>("kelas");
  const [pilih, setPilih] = useState<Prop | null>(null);
  const [cari, setCari] = useState("");
  const gelap = useGelap();
  const mode: Mode = gelap ? "gelap" : "terang";

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
    }).setView([-2.5, 118], 4.75);
    m.attributionControl.setPrefix(false).addAttribution('<a href="https://www.geoboundaries.org">geoBoundaries</a> (CC BY 4.0)');
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
            lapisGeo.current?.setStyle((x) => gaya.current(x!.properties as Prop));
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
    lapisGeo.current?.setStyle((x) => gaya.current(x!.properties as Prop));
  }, [lapis, gelap, batas]);

  const fokus = (key: string) => {
    if (!lapisGeo.current) return;
    lapisGeo.current.eachLayer((ly) => {
      const ft = (ly as L.GeoJSON).feature as GeoJSON.Feature<GeoJSON.Geometry, Prop>;
      if (ft.properties.key === key) {
        terpilih.current = key;
        setPilih(ft.properties);
        lapisGeo.current?.setStyle((x) => gaya.current(x!.properties as Prop));
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

  const info = t.lapis[lapis];

  return (
    <div className="space-y-4">
      <div className="kartu p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-base-content/70">{t.lapisan}</legend>
            <div className="flex flex-wrap gap-2">
              {LAPIS_KUNCI.map((k) => (
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
                  <span className="relative">{t.lapis[k].label}</span>
                </motion.button>
              ))}
            </div>
          </fieldset>
          <label className="w-full shrink-0 lg:w-72">
            <span className="mb-2 block text-sm font-medium text-base-content/70">{t.cari}</span>
            <span className="input w-full rounded-full">
              <Search className="size-4 opacity-60" aria-hidden />
              <input
                list="daftar-kab"
                placeholder={t.contoh}
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
          {/* isolate: z-index kontrol Leaflet (1000) tidak boleh menembus navbar sticky */}
          <div className="relative isolate z-0 overflow-hidden rounded-[1.25rem]">
            <div ref={wadah} data-lenis-prevent className="h-[460px] w-full sm:h-[600px]" role="region" aria-label={t.aria(info.label)} />
            {!data && !galat && <div className="absolute inset-0 grid place-items-center text-sm text-base-content/60">{t.memuat}</div>}
            {galat && <div className="absolute inset-0 grid place-items-center text-sm text-error">{t.gagal}</div>}
          </div>
          <div className="space-y-1.5 px-3 py-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={lapis} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <Legenda lapis={lapis} mode={mode} t={t} />
              </motion.div>
            </AnimatePresence>
            <p className="text-xs text-base-content/60">
              {lapis === "kelas" || lapis === "irbi" ? `${t.kelasCatatan} ` : ""}
              {t.petunjuk}
            </p>
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
                <Detail p={pilih} t={t} n={n} />
              ) : (
                <div className="grid h-full min-h-48 place-items-center text-center">
                  <p className="max-w-56 text-sm text-base-content/65">{t.kosong}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>

      <section className="kartu p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{t.tabel}</h2>
            <p className="mt-1 text-sm text-base-content/60">{t.tabelKet(daftar.length)}</p>
          </div>
          <label className="input w-full rounded-full sm:w-64">
            <Search className="size-4 opacity-60" aria-hidden />
            <input placeholder={t.saring} value={cari} onChange={(e) => setCari(e.target.value)} aria-label={t.saring} />
          </label>
        </div>
        <div data-lenis-prevent className="mt-4 max-h-[480px] overflow-auto overscroll-contain rounded-[1.25rem] border border-base-300">
          <table className="table table-pin-rows table-sm">
            <thead>
              <tr>
                {t.kol.map((c, i) => (
                  <th key={c} className={i >= 2 ? "text-right" : ""}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {daftar.map((p) => (
                <tr key={p.key} className="cursor-pointer hover:bg-base-200" onClick={() => fokus(p.key)}>
                  <td>{p.nama}</td>
                  <td>{p.prov}</td>
                  <td className="text-right">{n(p.ead!, 1)}</td>
                  <td className="text-right">{p.kelas}</td>
                  <td className="text-right">{ROMAWI[p.ojk_zona ?? 0]}</td>
                  <td className="text-right">{p.irbi == null ? "–" : n(p.irbi, 2)}</td>
                  <td className="text-right">{n(p.aktual ?? 0, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

type Teks = (typeof T)["id"] | (typeof T)["en"];

function Legenda({ lapis, mode, t }: { lapis: Lapis; mode: Mode; t: Teks }) {
  const info = t.lapis[lapis];
  const kotak = (c: string) => <span className="inline-block h-3 w-5 rounded-sm" style={{ background: c }} aria-hidden />;
  if (lapis === "ojk_banding") {
    const b = BANDING[mode];
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <span className="flex items-center gap-2">
          {kotak(b.sesuai)}
          {t.sejalan}
        </span>
        <span className="flex items-center gap-2">
          {kotak(b.terlalu_rendah)}
          {t.ojkRendah}
        </span>
        <span className="flex items-center gap-2">
          {kotak(b.terlalu_tinggi)}
          {t.ojkTinggi}
        </span>
        <span className="flex items-center gap-2">
          {kotak(KOSONG[mode])}
          {t.tidakDinilai}
        </span>
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
        {lapis === "aktual" ? t.belumRusak : t.tidakDinilai}
      </span>
    </div>
  );
}

function Detail({ p, t, n }: { p: Prop; t: Teks; n: (x: number, d?: number) => string }) {
  if (p.kelas == null)
    return (
      <div>
        <h2 className="text-xl font-semibold">{p.nama}</h2>
        <p className="text-sm text-base-content/60">{p.prov}</p>
        <p className="mt-3 text-sm">{t.samosir}</p>
      </div>
    );
  const baris: [string, string][] = [
    [t.ojk, `${ROMAWI[p.ojk_zona ?? 0]}${p.ojk_imputasi ? t.induk : ""}`],
    [t.irbi, p.irbi == null ? "–" : `${n(p.irbi, 2)} (${t.irbiKelas[p.irbi_kelas ?? ""] ?? ""})`],
    [t.zona, `${p.skater} / ${p.kmeans}`],
    [t.rusak, `${n(p.aktual ?? 0, 2)} ${t.rusakSat}`],
    [t.penduduk, n(p.penduduk ?? 0)],
    [t.miskin, `${n(p.p0 ?? 0, 2)}%`],
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold">{p.nama}</h2>
      <p className="text-sm text-base-content/60">{p.prov}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-[1.25rem] bg-primary p-4 text-primary-content">
          <p className="text-xs opacity-85">{t.ead}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{n(p.ead!, 1)}</p>
          <p className="text-xs opacity-85">{t.eadSat}</p>
        </div>
        <div className="rounded-[1.25rem] bg-base-200 p-4">
          <p className="text-xs text-base-content/65">{t.kelasRisiko}</p>
          <p className="mt-1 text-2xl font-semibold">
            {p.kelas}
            <span className="text-base font-normal text-base-content/60"> / 5</span>
          </p>
          <p className="text-xs text-base-content/65">{t.tingkat[p.kelas]}</p>
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
        <p className="mt-4 rounded-[1.25rem] bg-warning p-4 text-xs text-warning-content">{p.ojk_banding === "terlalu_tinggi" ? t.catatanTinggi : t.catatanRendah}</p>
      )}
    </div>
  );
}
