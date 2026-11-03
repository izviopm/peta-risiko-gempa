import type { Metadata } from "next";
import { Bagian, Halaman } from "@/components/Halaman";
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

export default function Tentang() {
  return (
    <Halaman judul="Tentang penelitian ini">
      <Bagian judul="Naskah">
        <p className="max-w-3xl text-lg">{JUDUL}</p>
        <p className="mt-3 text-base-content/70">Izvio Prijaya Mumin · Divisi IT, PT Reasuransi MAIPARK Indonesia · Versi 1.1, 3 November 2026</p>
      </Bagian>

      <Bagian judul="Kontribusi">
        <ol className="list-decimal space-y-2 pl-5 text-base-content/80">
          <li>Kerangka validasi prediktif out-of-time untuk indeks risiko gempa tingkat kabupaten/kota di Indonesia, sepenuhnya dari data publik.</li>
          <li>Bukti empiris daya prediksi IRBI resmi, zona tarif gempa OJK 2017, dan pembobotan Entropy.</li>
          <li>Indeks EAD dalam satuan rumah ekuivalen hancur total yang dapat dikaitkan langsung dengan kerugian (re)asuransi.</li>
          <li>Bukti mengenai layak tidaknya regionalisasi nasional lima zona yang kontigu untuk risiko gempa.</li>
        </ol>
      </Bagian>

      <Bagian judul="Cara mengutip">
        <pre className="whitespace-pre-wrap rounded-box bg-base-200 p-4 text-sm">
          I. P. Mumin, &quot;{JUDUL},&quot; draf penelitian v1, PT Reasuransi MAIPARK Indonesia, Jakarta, 2026.
        </pre>
      </Bagian>

      <Bagian judul="Ketersediaan data dan kode">
        <p className="max-w-3xl text-base-content/80">
          Seluruh data bersifat publik (lihat halaman Dataset). Skrip yang mereproduksi setiap angka beserta panduan langkah demi langkah
          dapat diminta dari penulis.
        </p>
      </Bagian>

      <Bagian judul="Penafian">
        <p className="max-w-3xl text-base-content/80">
          Pandangan dan kesimpulan dalam penelitian ini adalah milik penulis dan tidak mewakili sikap resmi PT Reasuransi MAIPARK Indonesia,
          BNPB, maupun OJK. Hasilnya berupa indeks relatif antar-kabupaten dari data historis; bukan prakiraan gempa, bukan estimasi
          kerugian dalam rupiah, dan bukan dasar penetapan tarif, underwriting, atau keputusan investasi.
        </p>
      </Bagian>

      <Bagian judul="Konflik kepentingan dan pendanaan">
        <p className="max-w-3xl text-base-content/80">
          Penulis bekerja di perusahaan reasuransi yang diawasi OJK dan bergerak di lini risiko gempa. Penelitian ini tidak memakai data
          eksposur, polis, klaim, maupun data internal perusahaan, dan tidak menerima pendanaan khusus.
        </p>
      </Bagian>

      <Bagian judul={`Daftar pustaka (${R.referensi.length})`}>
        <ol className="space-y-2 text-sm text-base-content/80">
          {R.referensi.map((r, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr]">
              <span className="text-base-content/50">[{i + 1}]</span>
              <span>
                <Ref teks={r} />
              </span>
            </li>
          ))}
        </ol>
      </Bagian>
    </Halaman>
  );
}
