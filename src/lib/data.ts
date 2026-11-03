import ringkasan from "../../public/data/ringkasan.json";

export const R = ringkasan;

/** Format angka gaya Indonesia (koma desimal). */
export function f(n: number, d = 3) {
  return n.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export const NAMA_INDEKS: Record<string, string> = {
  "USULAN (NB-EAD)": "Usulan (NB-EAD)",
  "IRBI 2024": "IRBI 2024",
  "Zona tarif OJK 2017": "Zona tarif OJK 2017",
  "Bobot setara": "Bobot setara",
  Entropy: "Entropy",
  CRITIC: "CRITIC",
};

export const validasi = R.validasi.map((v) => ({ ...v, label: NAMA_INDEKS[v.indeks] ?? v.indeks }));
export const usulan = validasi[0];
export const irbi = validasi.find((v) => v.indeks === "IRBI 2024")!;
export const ojk = validasi.find((v) => v.indeks === "Zona tarif OJK 2017")!;
