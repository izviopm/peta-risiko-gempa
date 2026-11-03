export type Lang = "id" | "en";

/** Rute tiap halaman per bahasa. Bahasa Indonesia tanpa awalan, Inggris di bawah /en. */
export const RUTE = {
  beranda: { id: "/", en: "/en" },
  peta: { id: "/peta", en: "/en/map" },
  tentang: { id: "/tentang", en: "/en/about" },
  alur: { id: "/tentang/alur", en: "/en/about/workflow" },
  dataset: { id: "/tentang/dataset", en: "/en/about/data" },
  hasil: { id: "/tentang/hasil", en: "/en/about/results" },
  keterbatasan: { id: "/tentang/keterbatasan", en: "/en/about/limitations" },
} as const;
export type Rute = keyof typeof RUTE;

export const rute = (k: Rute, lang: Lang) => RUTE[k][lang];

export const langDari = (path: string): Lang => (path === "/en" || path.startsWith("/en/") ? "en" : "id");

/** Alamat halaman yang sama dalam bahasa lain (hash tidak ikut). */
export function padanan(path: string): string {
  const asal = langDari(path);
  const lain: Lang = asal === "id" ? "en" : "id";
  const k = (Object.keys(RUTE) as Rute[]).find((r) => RUTE[r][asal] === path);
  return k ? RUTE[k][lain] : RUTE.beranda[lain];
}

/** Format angka: koma desimal untuk Indonesia, titik untuk Inggris. */
export function f(n: number, d = 3, lang: Lang = "id") {
  return n.toLocaleString(lang === "en" ? "en-US" : "id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
}
