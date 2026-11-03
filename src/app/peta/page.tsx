import type { Metadata } from "next";
import Link from "next/link";
import { Halaman } from "@/components/Halaman";
import PetaKlien from "@/components/PetaKlien";

export const metadata: Metadata = { title: "Peta" };

export default function Peta() {
  return (
    <Halaman
      judul="Peta interaktif"
      pengantar={
        <p>
          Bandingkan indeks usulan dengan zona tarif OJK, IRBI 2024, hasil zonasi, dan kerusakan yang benar-benar terjadi pada
          2020–2026. Satuan EAD adalah rumah ekuivalen hancur total per tahun; cara menghitungnya dijelaskan di{" "}
          <Link href="/alur" className="link">
            alur penelitian
          </Link>
          .
        </p>
      }
    >
      <PetaKlien />
    </Halaman>
  );
}
