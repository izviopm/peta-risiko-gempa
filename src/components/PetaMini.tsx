import mini from "../../public/data/peta_mini.json";
import type { Lang } from "@/lib/i18n";

// Kelas 1..5 sebagai tingkat opasitas warna primary, supaya ikut tema terang dan gelap.
const OPASITAS = [0.14, 0.28, 0.45, 0.62, 0.8, 1];

/** Pratinjau statis peta indeks (server component, tanpa Leaflet). */
export default function PetaMini({ lang, className = "" }: { lang: Lang; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${mini.w} ${mini.h}`}
      className={className}
      role="img"
      aria-label={lang === "en" ? "Preview of the earthquake risk index map by district" : "Pratinjau peta indeks risiko gempa per kabupaten/kota"}
    >
      {mini.paths.map((p) => (
        <path key={p.k} d={p.d} fill="var(--color-primary)" fillOpacity={OPASITAS[p.k]} />
      ))}
    </svg>
  );
}
