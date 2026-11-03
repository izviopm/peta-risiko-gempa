import type { Lang, Rute } from "./i18n";

type Item = { k: Rute; label: Record<Lang, string> };

export const MENU: Item[] = [
  { k: "beranda", label: { id: "Beranda", en: "Home" } },
  { k: "peta", label: { id: "Peta", en: "Map" } },
  { k: "tentang", label: { id: "Tentang", en: "About" } },
];

/** Sub-halaman di bawah Tentang. */
export const SUB_TENTANG: Item[] = [
  { k: "tentang", label: { id: "Ringkasan", en: "Overview" } },
  { k: "alur", label: { id: "Alur penelitian", en: "How it works" } },
  { k: "dataset", label: { id: "Dataset", en: "Data" } },
  { k: "hasil", label: { id: "Hasil", en: "Results" } },
  { k: "keterbatasan", label: { id: "Keterbatasan", en: "Limitations" } },
];
