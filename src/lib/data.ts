import ringkasan from "../../public/data/ringkasan_v2.json";
import type { Lang } from "./i18n";

export { f } from "./i18n";

/** Hasil naskah v2 (pengembangan-v2/scripts/ekspor_web_v2.py). Peta memakai kabupaten.geojson dari analisis pendahuluan. */
export const R = ringkasan;

const NAMA: Record<string, Record<Lang, string>> = {
  "NB-EAD v4": { id: "Indeks NB-EAD", en: "NB-EAD index" },
  "IRBI 2024": { id: "IRBI 2024", en: "IRBI 2024" },
  "Zona tarif OJK 2017": { id: "Zona tarif OJK 2017", en: "OJK 2017 tariff zones" },
  "Bobot setara": { id: "Bobot setara", en: "Equal weights" },
  Entropy: { id: "Entropy", en: "Entropy" },
  CRITIC: { id: "CRITIC", en: "CRITIC" },
  "Penduduk saja": { id: "Penduduk saja", en: "Population only" },
  "Bahaya saja": { id: "Bahaya saja", en: "Hazard only" },
};

export const namaIndeks = (indeks: string, lang: Lang) => NAMA[indeks]?.[lang] ?? indeks;

export const USULAN = "NB-EAD v4";
export const auc = R.auc;
export const cari = (indeks: string) => auc.find((v) => v.indeks === indeks)!;
export const usulan = cari(USULAN);
export const h1 = (pembanding: string) => R.h1.find((x) => x.pembanding === pembanding)!;
