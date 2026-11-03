import Link from "next/link";
import { Halaman } from "@/components/Halaman";
import PetaKlien from "@/components/PetaKlien";
import { type Lang, rute } from "@/lib/i18n";

export default function Peta({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <Halaman
      label={en ? "512 districts · 7 layers" : "512 kabupaten/kota · 7 lapisan"}
      judul={en ? "Interactive map" : "Peta interaktif"}
      pengantar={
        en ? (
          <p>
            Pick a layer to compare our risk score with the OJK tariff zones, IRBI 2024, the zoning results, and the houses that were actually damaged in 2020 to
            2026. Click a district to see its details. The{" "}
            <Link href={`${rute("tentang", lang)}#istilah`} className="link">
              glossary
            </Link>{" "}
            explains the terms.
          </p>
        ) : (
          <p>
            Pilih lapisan untuk membandingkan skor risiko kami dengan zona tarif OJK, IRBI 2024, hasil pengelompokan zona, dan rumah yang benar-benar rusak pada
            2020–2026. Klik satu daerah untuk melihat rinciannya. Arti istilahnya ada di{" "}
            <Link href={`${rute("tentang", lang)}#istilah`} className="link">
              daftar istilah
            </Link>
            .
          </p>
        )
      }
    >
      <PetaKlien lang={lang} />
    </Halaman>
  );
}
