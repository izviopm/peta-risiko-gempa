import type { Metadata } from "next";
import { Bagian, Halaman } from "@/components/Halaman";

export const metadata: Metadata = { title: "Keterbatasan" };

const LINGKUP = [
  "Hanya guncangan gempa. Tsunami, likuifaksi, dan longsor tidak dimodelkan terpisah, padahal kerusakannya ikut tercatat di DIBI (mis. Palu 2018).",
  "Unit analisis kabupaten/kota (514, batas tahun 2020), tidak sampai kecamatan atau desa.",
  "Ukuran kerugian adalah jumlah rumah rusak, bukan nilai rupiah, klaim asuransi, korban jiwa, atau bangunan non-hunian.",
  "Label kerusakan 2008–2026; riwayat bahaya 1973–2019.",
  "100% data publik, tanpa data eksposur, polis, atau klaim internal perusahaan.",
  "Keluaran berupa peringkat relatif antar-kabupaten, bukan model katastrofe probabilistik. Tidak menghasilkan PML/AAL dan tidak dapat langsung dipakai untuk penetapan harga.",
];

const KELOMPOK = [
  {
    judul: "Data",
    isi: [
      "DIBI hanya mencatat kabupaten terdampak dan mungkin kurang lapor. Kabupaten terguncang yang tidak tercatat diasumsikan nol kerusakan.",
      "Jam kejadian DIBI tidak andal (banyak nilai default), sehingga hanya tanggal yang dipakai.",
      "Kemungkinan penghitungan ganda pada gempa beruntun: di Lombok Utara 2018 jumlah rumah rusak melebihi perkiraan jumlah rumah tangga (rasio 1,34).",
      "Kategori kerusakan tidak selalu diisi; beberapa kejadian besar mencatat rusak sedang = 0 seluruhnya (mis. Padang 2009).",
      "Katalog USGS tidak lengkap untuk gempa lokal kecil (M < 4), jenis magnitudo tidak diseragamkan, dan kelengkapan M ≥ 5 dekade 1970-an belum diverifikasi.",
      "Penduduk diturunkan dari statistik kemiskinan (selisih ±1–10% terhadap SP2020). Indeks memakai kondisi sosial-ekonomi 2019 untuk semua kejadian.",
      "Jarak gempa diukur ke titik representatif poligon, bukan pusat populasi.",
      "Kabupaten pemekaran setelah 2020 dipetakan ke induknya; tiga kabupaten pemekaran 2014 diberi zona OJK kabupaten induk.",
    ],
  },
  {
    judul: "Metode",
    isi: [
      "Proxy guncangan sederhana (M − 2·log₁₀ R), bukan model gerakan tanah atau ShakeMap; tidak memperhitungkan efek tanah lokal dan geometri patahan.",
      "Pencocokan DIBI–USGS heuristik; 32 pasangan berselisih tanggal di tepi jendela dan 119 berjarak > 150 km belum diperiksa satu per satu.",
      "Central damage ratio 0,70/0,30/0,05 bersifat umum, belum dikalibrasi untuk rumah Indonesia.",
      "Model sangat timpang (±99% nol), pseudo-R² 0,222. Model zero-inflated/hurdle dan efek acak spasial belum diuji.",
      "Batas stok rumah memakai rata-rata nasional empat orang per rumah tangga.",
      "Declustering Gardner–Knopoff dikembangkan dari data California; gempa pendahuluan tetap dihitung.",
      "XGBoost pembanding tidak dituning. Komponen indeks komposit pembanding ditentukan peneliti.",
      "Ketetanggaan antarpulau pada SKATER bersifat buatan (8 tetangga terdekat), dan baru dua atribut yang dipakai.",
    ],
  },
  {
    judul: "Validasi",
    isi: [
      "Periode uji pendek (7 tahun, 152 kabupaten rusak). Lokasi gempa berikutnya acak; indeks ex-ante hanya menangkap kecenderungan jangka panjang.",
      "Hanya satu pembagian waktu (latih ≤ 2019, uji ≥ 2020); validasi rolling-origin belum dikerjakan.",
      "Bootstrap blok provinsi mengabaikan ketergantungan spasial lintas batas provinsi.",
      "Zona OJK hanya lima nilai sehingga banyak peringkat seri; ini merugikan OJK pada metrik peringkat.",
    ],
  },
];

const VERSI = [
  ["Riwayat bahaya", "2008–2019, semua gempa", "1973–2019, gempa utama", "1973–2019, gempa utama"],
  ["Bobot rusak berat/sedang/ringan", "1 / 0,5 / 0,25", "1 / 0,5 / 0,25", "0,70 / 0,30 / 0,05"],
  ["Spearman usulan", "0,297", "0,270", "0,252"],
  ["AUC usulan", "0,678", "0,658", "0,647"],
];

export default function Keterbatasan() {
  return (
    <Halaman
      judul="Keterbatasan dan transparansi"
      pengantar={<p>Kami mencatat setiap penyederhanaan, asumsi, dan data yang dikurangi supaya hasil penelitian ini bisa dinilai apa adanya.</p>}
    >
      <Bagian judul="Batasan masalah">
        <ul className="list-disc space-y-2 pl-5 text-base-content/80">
          {LINGKUP.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Bagian>

      {KELOMPOK.map((k) => (
        <Bagian key={k.judul} judul={`Keterbatasan ${k.judul.toLowerCase()}`}>
          <ul className="list-disc space-y-2 pl-5 text-base-content/80">
            {k.isi.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Bagian>
      ))}

      <Bagian judul="Riwayat versi analisis">
        <p className="max-w-3xl text-base-content/75">
          Data uji dievaluasi untuk tiga versi model. Setiap perubahan diputuskan dengan alasan ilmiah yang tercatat sebelum versi
          berikutnya dievaluasi, dan setiap perubahan justru menurunkan metrik indeks usulan. Model dibekukan pada v3. Data uji dipakai
          sekali lagi untuk menilai pembanding zona OJK tanpa mengubah model.
        </p>
        <div className="mt-4 overflow-x-auto rounded-box border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th />
                <th>v1</th>
                <th>v2</th>
                <th>v3 (utama)</th>
              </tr>
            </thead>
            <tbody>
              {VERSI.map(([a, ...b]) => (
                <tr key={a}>
                  <td>{a}</td>
                  {b.map((x, i) => (
                    <td key={i} className={i === 2 ? "font-semibold" : ""}>
                      {x}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bagian>

      <Bagian judul="Catatan transparansi">
        <ul className="list-disc space-y-2 pl-5 text-base-content/80">
          <li>
            <strong>Perumusan ulang kontribusi setelah melihat hasil.</strong> Rencana awal mengklaim bahwa bobot berbasis data lebih unggul
            dari bobot sederhana. Karena klaim itu hanya terbukti sebagian, kontribusi utama dirumuskan ulang menjadi kerangka validasi
            beserta temuannya terhadap indeks yang ada. Hipotesis awal tetap dilaporkan beserta hasilnya.
          </li>
          <li>
            <strong>Penggunaan AI.</strong> Asisten AI (Claude, Anthropic) membantu penelusuran literatur, penulisan kode, dan penyusunan
            draf. Semua angka berasal dari skrip yang dijalankan ulang dari awal; penulis bertanggung jawab atas isinya.
          </li>
          <li>
            <strong>Literatur.</strong> Penelusuran hanya lewat OpenAlex, artikel open access 2024–2026. Klaim &quot;pertama&quot; harus
            dibaca sebagai &quot;sepanjang penelusuran kami&quot;.
          </li>
          <li>
            <strong>Belum dikerjakan:</strong> zonasi REDCap, validasi rolling-origin, eksposur tingkat bangunan, dan data klaim asuransi.
          </li>
        </ul>
      </Bagian>
    </Halaman>
  );
}
