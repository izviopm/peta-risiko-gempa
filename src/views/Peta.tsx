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
            Pick a layer to compare the NB-EAD risk score with the OJK tariff zones, IRBI 2024, the zoning results, and the houses that were actually damaged in 2020 to
            2026. Click a district to see its details. The{" "}
            <Link href={`${rute("tentang", lang)}#istilah`} className="link">
              glossary
            </Link>{" "}
            explains the terms. The scores on this map come from the preliminary analysis (shaking history 1973-2019); the results of paper version 2.0 are on the{" "}
            <Link href={rute("hasil", lang)} className="link">
              Results
            </Link>{" "}
            page.
          </p>
        ) : (
          <p>
            Pilih lapisan untuk membandingkan skor risiko NB-EAD dengan zona tarif OJK, IRBI 2024, hasil pengelompokan zona, dan rumah yang benar-benar rusak pada
            2020–2026. Klik satu daerah untuk melihat rinciannya. Arti istilahnya ada di{" "}
            <Link href={`${rute("tentang", lang)}#istilah`} className="link">
              daftar istilah
            </Link>
            . Skor di peta ini berasal dari analisis pendahuluan (riwayat guncangan 1973–2019); hasil naskah versi 2.0 ada di halaman{" "}
            <Link href={rute("hasil", lang)} className="link">
              Hasil
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
