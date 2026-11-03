import type { Metadata } from "next";
import { Bagian, Halaman } from "@/components/Halaman";

export const metadata: Metadata = { title: "Dataset" };

const DATA = [
  {
    nama: "Data Informasi Bencana Indonesia (DIBI)",
    penyedia: "BNPB",
    url: "https://dibi.bnpb.go.id",
    periode: "2008–2026",
    jumlah: "725 catatan, 243 kabupaten, 32 provinsi",
    guna: "Target: jumlah rumah rusak berat, sedang, dan ringan per kejadian dan kabupaten.",
    ambil: "Ekspor CSV manual dari tab Tabular dengan filter Kategori = Gempabumi dan Is Bencana = TRUE (30 Okt 2026).",
    sebar: "Tidak disediakan ulang. Ambil langsung dari portal DIBI; isinya terus diperbarui.",
  },
  {
    nama: "ANSS Comprehensive Earthquake Catalog (ComCat)",
    penyedia: "U.S. Geological Survey",
    url: "https://earthquake.usgs.gov/fdsnws/event/1/",
    periode: "M ≥ 4: 2008–2026 · M ≥ 5: 1973–2026",
    jumlah: "36.870 kejadian M ≥ 4 · 12.727 kejadian M ≥ 5 (6.596 gempa utama)",
    guna: "Pencocokan kejadian dan riwayat bahaya, wilayah 11°LS–6°LU, 95–141°BT.",
    ambil: "Diunduh otomatis lewat API FDSN.",
    sebar: "Domain publik, tetapi tidak kami salin karena mudah diunduh ulang dan kadang direvisi USGS.",
  },
  {
    nama: "Batas administrasi kabupaten/kota (ADM2)",
    penyedia: "geoBoundaries (sumber BPS/OCHA, 2020)",
    url: "https://www.geoboundaries.org",
    periode: "2020",
    jumlah: "514 kabupaten/kota",
    guna: "Unit analisis, jarak ke gempa, luas wilayah.",
    ambil: "Diunduh otomatis.",
    sebar: "Lisensi CC BY 4.0. Versi yang disederhanakan (±1 km) dipakai untuk peta di situs ini dengan atribusi.",
  },
  {
    nama: "WebAPI BPS (variabel 619 dan 621)",
    penyedia: "Badan Pusat Statistik",
    url: "https://webapi.bps.go.id",
    periode: "2004–2025",
    jumlah: "514 kabupaten/kota",
    guna: "Persentase penduduk miskin (P0) sebagai kerentanan; jumlah penduduk diturunkan dari jumlah penduduk miskin ÷ P0.",
    ambil: "Lewat API dengan kunci gratis (daftar akun BPS).",
    sebar: "Tidak disediakan ulang. Akses lewat API resmi BPS.",
  },
  {
    nama: "Buku Indeks Risiko Bencana Indonesia (IRBI) 2024",
    penyedia: "BNPB",
    url: "https://inarisk.bnpb.go.id",
    periode: "2024",
    jumlah: "514 baris skor gempa (512 terpakai)",
    guna: "Pembanding: skor risiko gempa resmi per kabupaten, halaman 226–243.",
    ambil: "Unduh PDF dari menu Unduhan InaRISK, lalu tabel diekstrak dengan skrip.",
    sebar: "PDF tidak disediakan ulang. Skornya ditampilkan di peta sebagai pembanding dengan sitasi.",
  },
  {
    nama: "SEOJK No. 6/SEOJK.05/2017, Lampiran III Tabel III.D",
    penyedia: "Otoritas Jasa Keuangan",
    url: "https://ojk.go.id",
    periode: "2017 (masih berlaku)",
    jumlah: "511 entri zona gempa I–V",
    guna: "Pembanding dan analisis kesesuaian zona tarif.",
    ambil: "Unduh lampiran dari halaman regulasi OJK, lalu tabel diekstrak dengan skrip.",
    sebar: "Dokumen tidak disediakan ulang. Zonanya ditampilkan di peta dengan sitasi.",
  },
];

const DIKELUARKAN = [
  ["Catatan DIBI tanpa pasangan gempa USGS", "20 dari 725", "Tidak ada gempa ≤ 300 km dalam rentang tanggal"],
  ["Pasangan DIBI dengan guncangan di bawah ambang (dari data latih)", "39", "Kemungkinan salah cocok dengan gempa lokal kecil yang tidak tercatat USGS"],
  ["Samosir dan Toba Samosir", "2 kabupaten", "Tabel IRBI 2024 mencantumkan \"Toba Samosir\" dua kali"],
  ["PDRB kabupaten", "seluruh variabel", "Hanya tersedia 2022–2025, berisiko bocor ke periode latih 2008–2019"],
  ["Penetrasi asuransi per kabupaten", "–", "Tidak tersedia untuk publik"],
  ["Data eksposur, polis, dan klaim perusahaan", "–", "Sengaja tidak dipakai; penelitian ini 100% data publik"],
];

export default function Dataset() {
  return (
    <Halaman
      judul="Dataset"
      pengantar={
        <p>
          Semua data berasal dari sumber publik. Situs ini hanya menampilkan hasil olahan kami (skor indeks, zonasi, kesesuaian zona)
          dan batas wilayah yang disederhanakan. Data mentah tidak kami sebarkan ulang; tautan dan cara mengambilnya ada di bawah.
        </p>
      }
    >
      <Bagian judul="Sumber data">
        <div className="grid gap-4 md:grid-cols-2">
          {DATA.map((d) => (
            <article key={d.nama} className="rounded-box border border-base-300 p-5">
              <h3 className="font-semibold">{d.nama}</h3>
              <p className="text-sm text-base-content/60">
                {d.penyedia} ·{" "}
                <a href={d.url} className="link" target="_blank" rel="noreferrer">
                  {d.url.replace(/^https:\/\//, "")}
                </a>
              </p>
              <dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="text-base-content/60">Periode</dt>
                <dd>{d.periode}</dd>
                <dt className="text-base-content/60">Jumlah</dt>
                <dd>{d.jumlah}</dd>
                <dt className="text-base-content/60">Kegunaan</dt>
                <dd>{d.guna}</dd>
                <dt className="text-base-content/60">Cara ambil</dt>
                <dd>{d.ambil}</dd>
                <dt className="text-base-content/60">Distribusi</dt>
                <dd>{d.sebar}</dd>
              </dl>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-base-content/60">Data versi penelitian diakses atau diekspor 30–31 Oktober 2026.</p>
      </Bagian>

      <Bagian judul="Data yang dikurangi atau tidak dipakai">
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Yang dikeluarkan</th>
                <th>Jumlah</th>
                <th>Alasan</th>
              </tr>
            </thead>
            <tbody>
              {DIKELUARKAN.map(([a, b, c]) => (
                <tr key={a}>
                  <td>{a}</td>
                  <td className="whitespace-nowrap">{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bagian>

      <Bagian judul="File yang dipakai situs ini">
        <p className="max-w-3xl text-base-content/75">
          <code className="rounded bg-base-200 px-1">/data/kabupaten.geojson</code> berisi batas wilayah yang disederhanakan beserta
          hasil indeks per kabupaten, dan <code className="rounded bg-base-200 px-1">/data/ringkasan.json</code> berisi tabel hasil
          validasi, uji ketahanan, dan zonasi. Keduanya hasil olahan penelitian ini; batas wilayahnya tetap tunduk pada lisensi CC BY 4.0
          geoBoundaries.
        </p>
      </Bagian>
    </Halaman>
  );
}
