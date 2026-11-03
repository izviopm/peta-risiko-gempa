import ringkasan from "../../public/data/ringkasan.json";
import type { Lang } from "./i18n";

export { f } from "./i18n";

export const R = ringkasan;

const NAMA: Record<string, Record<Lang, string>> = {
  "USULAN (NB-EAD)": { id: "Indeks kami (NB-EAD)", en: "Our index (NB-EAD)" },
  "IRBI 2024": { id: "IRBI 2024", en: "IRBI 2024" },
  "Zona tarif OJK 2017": { id: "Zona tarif OJK 2017", en: "OJK 2017 tariff zones" },
  "Bobot setara": { id: "Bobot setara", en: "Equal weights" },
  Entropy: { id: "Entropy", en: "Entropy" },
  CRITIC: { id: "CRITIC", en: "CRITIC" },
};

export const namaIndeks = (indeks: string, lang: Lang) => NAMA[indeks]?.[lang] ?? indeks;

export const validasi = R.validasi;
export const usulan = validasi[0];
export const cari = (indeks: string) => validasi.find((v) => v.indeks === indeks)!;
