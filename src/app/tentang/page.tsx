import type { Metadata } from "next";
import { ArrowUpRight, BarChart3, Database, ShieldAlert, Workflow } from "lucide-react";
import Link from "next/link";
import { Bagian, Halaman } from "@/components/Halaman";
import Reveal from "@/components/Reveal";
import { R } from "@/lib/data";

export const metadata: Metadata = { title: "Tentang" };

const JUDUL =
  "Validasi Prediktif Out-of-Time Indeks Risiko Gempa Bumi Tingkat Kabupaten/Kota di Indonesia Menggunakan Data Kerusakan Rumah Historis dan Pemodelan Ekspektasi Kerusakan Negative Binomial";

/** Ubah "doi: 10.x" menjadi tautan dan *miring* menjadi <em>. */
function Ref({ teks }: { teks: string }) {
  const bagian = teks.split(/(\*[^*]+\*|doi: \S+?(?=[.,]?$)|https?:\/\/\S+?(?=,|$))/g);
  return (
    <>
      {bagian.map((b, i) => {
        if (b.startsWith("*")) return <em key={i}>{b.slice(1, -1)}</em>;
        if (b.startsWith("doi: "))
          return (
            <a key={i} className="link" href={`https://doi.org/${b.slice(5)}`} target="_blank" rel="noreferrer">
              {b}
            </a>
          );
        if (b.startsWith("http"))
          return (
            <a key={i} className="link" href={b} target="_blank" rel="noreferrer">
              {b}
            </a>
          );
        return b;
      })}
    </>
  );
}

const BAGIAN = [
  { href: "/tentang/alur", judul: "Alur penelitian", isi: "Tujuh tahap dari catatan kerusakan sampai perbandingan dengan zona OJK, dan kaitannya dengan reasuransi.", Ikon: Workflow },
  { href: "/tentang/dataset", judul: "Dataset", isi: "Enam sumber data publik, lisensinya, cara mengambilnya, dan data yang dikeluarkan.", Ikon: Database },
  { href: "/tentang/hasil", judul: "Hasil", isi: "Model, validasi out-of-time, bootstrap, uji ketahanan, zonasi, dan kesesuaian OJK.", Ikon: BarChart3 },
  { href: "/tentang/keterbatasan", judul: "Keterbatasan", isi: "Batasan masalah, asumsi, riwayat versi analisis, dan catatan transparansi.", Ikon: ShieldAlert },
];

export default function Tentang() {
  return (
    <Halaman label="Tentang" judul="Tentang penelitian ini" pengantar={<p>{JUDUL}</p>}>
      <section aria-label="Bagian" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BAGIAN.map(({ href, judul, isi, Ikon }, i) => (
          <Reveal key={href} delay={i * 0.05}>
            <Link href={href} className="kartu group flex h-full flex-col p-6 transition-colors duration-200 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <span className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-full bg-base-200 text-primary">
                  <Ikon className="size-5" aria-hidden />
                </span>
                <ArrowUpRight className="size-5 text-base-content/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
              <span className="mt-5 text-lg font-semibold">{judul}</span>
              <span className="mt-1 text-sm text-base-content/70">{isi}</span>
            </Link>
          </Reveal>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-12 [&>*]:min-w-0">
        <Reveal className="rounded-[var(--radius-box)] bg-primary p-6 text-primary-content sm:p-8 lg:col-span-5">
          <p className="text-sm opacity-85">Penulis</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">Izvio Prijaya Mumin</p>
          <p className="mt-1 opacity-90">Divisi IT, PT Reasuransi MAIPARK Indonesia</p>
          <p className="mt-6 text-sm opacity-85">Naskah versi 1.1 · 3 November 2026</p>
        </Reveal>
        <Bagian judul="Kontribusi" className="lg:col-span-7">
          <ol className="list-decimal space-y-2 pl-5 text-base-content/80">
            <li>Kerangka validasi prediktif out-of-time untuk indeks risiko gempa tingkat kabupaten/kota di Indonesia, sepenuhnya dari data publik.</li>
            <li>Bukti empiris daya prediksi IRBI resmi, zona tarif gempa OJK 2017, dan pembobotan Entropy.</li>
            <li>Indeks EAD dalam satuan rumah ekuivalen hancur total yang dapat dikaitkan langsung dengan kerugian (re)asuransi.</li>
            <li>Bukti mengenai layak tidaknya regionalisasi nasional lima zona yang kontigu untuk risiko gempa.</li>
          </ol>
        </Bagian>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        <Bagian judul="Penafian">
          <p className="text-base-content/80">
            Pandangan dan kesimpulan dalam penelitian ini adalah milik penulis dan tidak mewakili sikap resmi PT Reasuransi MAIPARK Indonesia,
            BNPB, maupun OJK. Hasilnya berupa indeks relatif antar-kabupaten dari data historis; bukan prakiraan gempa, bukan estimasi kerugian
            dalam rupiah, dan bukan dasar penetapan tarif, underwriting, atau keputusan investasi.
          </p>
        </Bagian>
        <Bagian judul="Konflik kepentingan dan pendanaan">
          <p className="text-base-content/80">
            Penulis bekerja di perusahaan reasuransi yang diawasi OJK dan bergerak di lini risiko gempa. Penelitian ini tidak memakai data
            eksposur, polis, klaim, maupun data internal perusahaan, dan tidak menerima pendanaan khusus.
          </p>
        </Bagian>
        <Bagian judul="Ketersediaan data dan kode">
          <p className="text-base-content/80">
            Seluruh data bersifat publik (lihat{" "}
            <Link href="/tentang/dataset" className="link">
              Dataset
            </Link>
            ). Skrip yang mereproduksi setiap angka beserta panduan langkah demi langkah dapat diminta dari penulis.
          </p>
        </Bagian>
        <Bagian judul="Cara mengutip">
          <pre className="whitespace-pre-wrap rounded-[1.25rem] bg-base-200 p-4 font-sans text-sm">
            I. P. Mumin, &quot;{JUDUL},&quot; naskah penelitian v1.1, PT Reasuransi MAIPARK Indonesia, Jakarta, 2026.
          </pre>
        </Bagian>
      </div>

      <Bagian id="pustaka" judul={`Daftar pustaka (${R.referensi.length})`}>
        <ol className="space-y-2 text-sm text-base-content/80">
          {R.referensi.map((r, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr]">
              <span className="text-base-content/50">[{i + 1}]</span>
              <span className="break-words">
                <Ref teks={r} />
              </span>
            </li>
          ))}
        </ol>
      </Bagian>
    </Halaman>
  );
}
