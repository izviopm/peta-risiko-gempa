import type { Metadata } from "next";
import { Bagian, Halaman } from "@/components/Halaman";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = { title: "Alur penelitian" };

const TAHAP = [
  {
    no: 1,
    judul: "Pencocokan kejadian",
    masuk: "725 catatan DIBI, katalog USGS M ≥ 4, batas kabupaten",
    isi: "DIBI mencatat kerusakan per kabupaten dan tanggal tanpa menyebut gempa penyebabnya. Untuk tiap catatan dicari gempa USGS dalam rentang 2 hari sebelum sampai 1 hari sesudah tanggal kejadian dan berjarak ≤ 300 km, lalu dipilih gempa dengan guncangan terbesar menurut proxy S = M − 2·log₁₀ R (R = jarak hiposenter, km).",
    keluar: "705 catatan (97%) cocok dengan 330 gempa. Padang 2009, Lombok 2018, Palu 2018, dan Cianjur 2022 terverifikasi.",
  },
  {
    no: 2,
    judul: "Dataset gempa × kabupaten",
    masuk: "Hasil tahap 1, penduduk dan kemiskinan BPS",
    isi: "DIBI hanya mencatat kabupaten yang rusak, jadi kabupaten yang terguncang tetapi tidak rusak ditambahkan sebagai pasangan bernilai nol (S ≥ 0,586, persentil ke-5 guncangan pada catatan berdampak). Kerusakan diubah ke satuan rumah ekuivalen hancur total: 0,70 × rusak berat + 0,30 × rusak sedang + 0,05 × rusak ringan.",
    keluar: "70.247 pasangan, 560 di antaranya rusak. Latih 2008–2019, uji 2020–2026.",
  },
  {
    no: 3,
    judul: "Pembobotan Negative Binomial",
    masuk: "Data latih 2008–2019",
    isi: "Jumlah rumah rusak sangat timpang (±99% nol) dan overdispersi, jadi dipakai model hitung Negative Binomial. Koefisiennya menjadi bobot bahaya, eksposur, dan kerentanan yang diturunkan dari data. XGBoost dipakai sebagai pembanding prediktif.",
    keluar: "Magnitudo, jarak, dan jumlah penduduk dominan. AUC tingkat pasangan 0,965 (XGBoost 0,939).",
  },
  {
    no: 4,
    judul: "Indeks EAD ex-ante",
    masuk: "Model tahap 3, katalog USGS M ≥ 5 1973–2019 (declustering)",
    isi: "Gempa susulan dibuang dengan jendela Gardner–Knopoff. Untuk tiap kabupaten, prediksi kerusakan dari setiap gempa utama dijumlahkan lalu dibagi 47 tahun. Prediksi per kejadian dibatasi stok rumah (penduduk ÷ 4).",
    keluar: "EAD per kabupaten untuk 512 kabupaten/kota, hanya memakai informasi sampai 2019.",
  },
  {
    no: 5,
    judul: "Validasi out-of-time",
    masuk: "Kerusakan aktual 2020–2026, lima pembanding",
    isi: "Indeks dibandingkan dengan IRBI 2024, zona tarif OJK 2017, dan indeks komposit berbobot setara, Entropy, dan CRITIC. Metrik: Spearman, AUC, presisi 50 teratas, porsi kerusakan di 10% teratas. Selisih diuji dengan 2.000 bootstrap kabupaten dan bootstrap blok provinsi.",
    keluar: "Lebih baik dari IRBI dan Entropy (signifikan), indikatif lebih baik dari OJK, setara dengan bobot sederhana.",
  },
  {
    no: 6,
    judul: "Zonasi",
    masuk: "log EAD dan log intensitas bahaya",
    isi: "Kabupaten dikelompokkan ke 5 zona (sejumlah zona OJK) dengan SKATER, yang memaksa zona menyatu secara geografis, dan dengan K-Means sebagai pembanding tanpa kendala.",
    keluar: "SKATER kontigu tetapi jauh kurang homogen (R² 0,565 vs 0,876).",
  },
  {
    no: 7,
    judul: "Kesesuaian dengan zona OJK",
    masuk: "Kuintil EAD, zona OJK I–V",
    isi: "Kesesuaian diukur dengan Cohen's kappa berbobot kuadratik, lalu dicatat kabupaten yang selisihnya besar.",
    keluar: "κ = 0,60. 3 kabupaten zona OJK lebih rendah, 52 lebih tinggi dari indeks.",
  },
];

const BISNIS = [
  {
    judul: "Pengendalian akumulasi",
    isi: "Reasuradur perlu tahu di mana risiko gempa dari banyak polis menumpuk. Indeks per kabupaten membantu menandai wilayah dengan riwayat kerusakan tinggi sebagai bahan pemantauan konsentrasi portofolio.",
  },
  {
    judul: "Penyaringan portofolio",
    isi: "Sebelum menjalankan model katastrofe penuh, indeks sederhana yang sudah divalidasi bisa dipakai untuk memprioritaskan wilayah yang perlu dianalisis lebih rinci.",
  },
  {
    judul: "Satuan yang bisa dikaitkan ke kerugian",
    isi: "EAD dinyatakan dalam rumah ekuivalen hancur total per tahun. Satuan ini lebih mudah dikaitkan ke kerugian (re)asuransi dibanding skor tanpa satuan seperti IRBI.",
  },
  {
    judul: "Pelengkap, bukan pengganti",
    isi: "Indeks ini tidak menghasilkan PML atau AAL dalam rupiah dan tidak memakai data polis atau klaim. Indeks dipakai berdampingan dengan model katastrofe probabilistik dan zona tarif yang berlaku.",
  },
];

export default function Alur() {
  return (
    <Halaman
      judul="Alur penelitian"
      pengantar={
        <p>
          Tujuh tahap dari catatan kerusakan mentah sampai perbandingan dengan zona tarif OJK. Setiap tahap dijalankan oleh skrip
          Python yang bisa diulang dari awal, dan seluruh angka di situs ini berasal dari hasil skrip tersebut.
        </p>
      }
    >
      <Bagian judul="Tujuh tahap">
        <ol className="relative space-y-4 border-l-2 border-base-300 pl-6">
          {TAHAP.map((t, i) => (
            <Reveal key={t.no} delay={i * 0.04}>
              <li className="relative">
                <span className="absolute -left-[37px] top-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-content">
                  {t.no}
                </span>
                <div className="rounded-box border border-base-300 p-5">
                  <h3 className="font-semibold">{t.judul}</h3>
                  <p className="mt-1 text-sm text-base-content/60">Masukan: {t.masuk}</p>
                  <p className="mt-3 text-base-content/80">{t.isi}</p>
                  <p className="mt-3 text-sm">
                    <span className="font-medium">Keluaran:</span> {t.keluar}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </Bagian>

      <Bagian judul="Desain anti-bocor waktu">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-box bg-base-200/60 p-5">
            <p className="text-sm text-base-content/60">Riwayat bahaya</p>
            <p className="mt-1 text-lg font-semibold">1973–2019</p>
            <p className="mt-2 text-sm text-base-content/75">Katalog USGS M ≥ 5 setelah gempa susulan dibuang.</p>
          </div>
          <div className="rounded-box bg-base-200/60 p-5">
            <p className="text-sm text-base-content/60">Pelatihan model</p>
            <p className="mt-1 text-lg font-semibold">2008–2019</p>
            <p className="mt-2 text-sm text-base-content/75">46.577 pasangan gempa–kabupaten, 231 rusak.</p>
          </div>
          <div className="rounded-box border-2 border-primary/50 p-5">
            <p className="text-sm text-base-content/60">Pengujian</p>
            <p className="mt-1 text-lg font-semibold">2020–2026</p>
            <p className="mt-2 text-sm text-base-content/75">Kerusakan yang tidak pernah dilihat model saat dibangun.</p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-base-content/70">
          Data PDRB BPS hanya tersedia 2022–2025, jadi tidak dipakai agar informasi masa depan tidak bocor ke periode latih. IRBI 2024
          disusun dengan informasi sampai 2024, sehingga perbandingannya justru menguntungkan IRBI.
        </p>
      </Bagian>

      <Bagian judul="Kaitannya dengan bisnis reasuransi">
        <div className="grid gap-4 md:grid-cols-2">
          {BISNIS.map((b) => (
            <div key={b.judul} className="rounded-box border border-base-300 p-5">
              <h3 className="font-semibold">{b.judul}</h3>
              <p className="mt-2 text-base-content/75">{b.isi}</p>
            </div>
          ))}
        </div>
      </Bagian>
    </Halaman>
  );
}
