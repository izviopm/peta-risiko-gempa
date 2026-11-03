import Link from "next/link";
import Reveal from "@/components/Reveal";
import { f, irbi, ojk, usulan } from "@/lib/data";

const ANGKA = [
  { nilai: "725", ket: "catatan kerusakan rumah akibat gempa dari DIBI BNPB, 2008–2026" },
  { nilai: "97%", ket: "catatan berhasil dipasangkan dengan gempa penyebabnya di katalog USGS" },
  { nilai: "512", ket: "kabupaten/kota diberi skor indeks dari data sampai 2019" },
  { nilai: "152", ket: "kabupaten/kota yang benar-benar mengalami kerusakan rumah 2020–2026 (data uji)" },
];

const TEMUAN = [
  {
    judul: "IRBI 2024 tidak memprediksi lokasi kerusakan",
    isi: `AUC ${f(irbi.auc_rusak)} dan Spearman ${f(irbi.spearman)}, setara tebakan acak, walaupun IRBI disusun dengan informasi sampai 2024.`,
  },
  {
    judul: "Indeks usulan lebih baik dari IRBI dan Entropy",
    isi: `AUC ${f(usulan.auc_rusak)} dan Spearman ${f(usulan.spearman)}. Selisihnya signifikan pada dua skema bootstrap dan lima skenario asumsi.`,
  },
  {
    judul: "Zona tarif OJK 2017 cukup informatif",
    isi: `AUC ${f(ojk.auc_rusak)} walaupun hanya lima tingkat. Keunggulan indeks usulan atas OJK baru signifikan pada bootstrap tingkat kabupaten.`,
  },
  {
    judul: "Bobot sederhana hampir sama baiknya",
    isi: "Indeks usulan tidak signifikan lebih baik dari bobot setara maupun CRITIC. Yang paling menentukan adalah pemilihan komponen dan validasi terhadap kerusakan aktual.",
  },
];

export default function Beranda() {
  return (
    <>
      <section className="border-b border-base-300 bg-base-200/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <Reveal>
            <p className="text-sm font-medium text-primary">Penelitian · data publik · November 2026</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Apakah indeks risiko gempa benar-benar menunjuk lokasi rumah yang kemudian rusak?
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-base-content/75">
              Kami membangun indeks ekspektasi kerusakan tahunan untuk 512 kabupaten/kota dari data sampai 2019, lalu mengujinya
              terhadap kerusakan rumah yang tercatat pada 2020–2026. Indeks ini dibandingkan dengan IRBI 2024, zona tarif gempa OJK
              2017, dan tiga skema pembobotan lain.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/peta" className="btn btn-primary">
                Buka peta
              </Link>
              <Link href="/alur" className="btn btn-outline">
                Lihat alur penelitian
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14">
        <section aria-label="Angka utama" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ANGKA.map((a, i) => (
            <Reveal key={a.nilai} delay={i * 0.06} className="rounded-box border border-base-300 p-5">
              <p className="text-4xl font-semibold tracking-tight">{a.nilai}</p>
              <p className="mt-2 text-sm text-base-content/70">{a.ket}</p>
            </Reveal>
          ))}
        </section>

        <section>
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight">Temuan utama</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {TEMUAN.map((t, i) => (
              <Reveal key={t.judul} delay={i * 0.06} className="rounded-box bg-base-200/60 p-6">
                <h3 className="font-semibold">{t.judul}</h3>
                <p className="mt-2 text-base-content/75">{t.isi}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-6 text-sm text-base-content/70">
              Angka lengkap dan selang kepercayaannya ada di halaman{" "}
              <Link href="/hasil" className="link">
                Hasil
              </Link>
              . Semua penyederhanaan dan asumsi kami catat di halaman{" "}
              <Link href="/keterbatasan" className="link">
                Keterbatasan
              </Link>
              .
            </p>
          </Reveal>
        </section>

        <Reveal>
          <section className="rounded-box border border-warning/40 bg-warning/10 p-6">
            <h2 className="font-semibold">Cara membaca peta ini</h2>
            <p className="mt-2 text-base-content/80">
              Indeks ini adalah peringkat relatif antar-kabupaten berdasarkan riwayat guncangan merusak 1973–2019. Indeks ini tidak
              meramalkan kapan atau di mana gempa berikutnya terjadi, tidak menghasilkan nilai kerugian dalam rupiah, dan tidak
              dimaksudkan sebagai dasar penetapan tarif asuransi. Kabupaten tanpa riwayat guncangan merusak belum tentu aman.
            </p>
          </section>
        </Reveal>
      </div>
    </>
  );
}
