import { Bagian, Halaman } from "@/components/Halaman";
import Reveal from "@/components/Reveal";
import type { Lang } from "@/lib/i18n";

const T = {
  id: {
    label: "Tentang",
    judul: "Alur penelitian",
    pengantar:
      "Tujuh langkah dari catatan rumah rusak sampai perbandingan dengan zona tarif OJK. Setiap langkah dijalankan oleh skrip Python yang bisa diulang dari awal, dan semua angka di situs ini berasal dari skrip tersebut.",
    tujuh: "Tujuh langkah",
    masukan: "Masukan",
    keluaran: "Hasil",
    tahap: [
      {
        judul: "Mencocokkan kerusakan dengan gempanya",
        masuk: "725 catatan rumah rusak (DIBI), katalog gempa USGS M ≥ 4, batas kabupaten/kota",
        isi: "DIBI mencatat rumah rusak per kabupaten dan tanggal, tetapi tidak menyebut gempa mana penyebabnya. Untuk setiap catatan dicari gempa USGS dari dua hari sebelum sampai satu hari sesudah tanggal kejadian, dalam jarak 300 km. Bila ada beberapa, dipilih gempa yang guncangannya paling kuat di kabupaten itu, dihitung dari magnitudo dan jaraknya.",
        keluar: "705 catatan (97%) cocok dengan 330 gempa. Gempa Padang 2009, Lombok 2018, Palu 2018, dan Cianjur 2022 terpasang dengan benar.",
      },
      {
        judul: "Menyusun data gempa × kabupaten",
        masuk: "Hasil langkah 1, data penduduk dan kemiskinan BPS",
        isi: "DIBI hanya mencatat kabupaten yang rusak. Karena itu kabupaten yang ikut terguncang tetapi tidak tercatat rusak ditambahkan dengan nilai kerusakan nol. Jumlah rumah rusak diubah ke satuan setara rumah hancur: 0,7 × rusak berat + 0,3 × rusak sedang + 0,05 × rusak ringan.",
        keluar: "70.247 pasangan gempa–kabupaten, 560 di antaranya ada rumah rusak. Data 2008–2019 untuk melatih model, 2020–2026 untuk menguji.",
      },
      {
        judul: "Mencari bobot setiap faktor",
        masuk: "Data latih 2008–2019",
        isi: "Sekitar 99% pasangan tidak punya rumah rusak, sementara sebagian kecil punya ribuan. Data seperti ini cocok dimodelkan dengan Negative Binomial, model statistik untuk data hitungan. Hasil model menunjukkan seberapa besar pengaruh magnitudo, jarak, kedalaman, jumlah penduduk, kepadatan, dan kemiskinan. Model XGBoost dipakai sebagai pembanding.",
        keluar: "Magnitudo, jarak, dan jumlah penduduk paling berpengaruh. Pada data uji, AUC tingkat pasangan 0,965 (XGBoost 0,939).",
      },
      {
        judul: "Menghitung skor risiko tiap kabupaten",
        masuk: "Model langkah 3, katalog gempa USGS M ≥ 5 tahun 1973–2019",
        isi: "Gempa susulan dibuang lebih dulu supaya satu rangkaian gempa tidak dihitung berkali-kali. Untuk setiap kabupaten, perkiraan kerusakan dari semua gempa utama selama 47 tahun dijumlahkan lalu dibagi 47. Perkiraan satu gempa dibatasi paling banyak sejumlah rumah yang ada (penduduk ÷ 4).",
        keluar: "Perkiraan kerusakan per tahun untuk 512 kabupaten/kota, hanya dari informasi sampai 2019.",
      },
      {
        judul: "Menguji pada kerusakan 2020–2026",
        masuk: "Rumah rusak yang tercatat 2020–2026, lima indeks pembanding",
        isi: "Skor NB-EAD dibandingkan dengan IRBI 2024, zona tarif OJK 2017, dan tiga indeks gabungan (bobot setara, Entropy, CRITIC). Ukurannya: AUC, korelasi peringkat, ketepatan 50 daerah teratas, dan porsi kerusakan yang jatuh di 10% daerah teratas. Selisih antarindeks diuji ulang secara acak 2.000 kali, per kabupaten dan per provinsi.",
        keluar: "Lebih tepat dari IRBI dan Entropy, sedikit lebih tepat dari zona OJK, dan setara dengan bobot sederhana.",
      },
      {
        judul: "Mengelompokkan daerah ke lima zona",
        masuk: "Skor risiko dan intensitas guncangan",
        isi: "Daerah dikelompokkan ke lima zona, sama dengan jumlah zona OJK. SKATER memaksa setiap zona menyambung di peta, sedangkan K-Means membebaskan zona terpencar. Keduanya lalu dibandingkan.",
        keluar: "Zona SKATER memang menyambung, tetapi isinya jauh kurang mirip satu sama lain (R² 0,565 vs 0,876).",
      },
      {
        judul: "Membandingkan dengan zona tarif OJK",
        masuk: "Kelas risiko NB-EAD 1–5, zona OJK I–V",
        isi: "Kesesuaian kelas risiko NB-EAD dengan zona OJK diukur dengan Cohen's kappa berbobot, lalu daerah yang selisihnya besar dicatat.",
        keluar: "Kesesuaian sedang (κ = 0,60). 3 daerah zona OJK-nya lebih rendah dari skor NB-EAD, 52 lebih tinggi.",
      },
    ],
    waktuJudul: "Data masa depan tidak bocor ke model",
    waktu: [
      ["Riwayat guncangan", "1973–2019", "Katalog USGS M ≥ 5 tanpa gempa susulan."],
      ["Melatih model", "2008–2019", "46.577 pasangan gempa–kabupaten, 231 ada rumah rusak."],
      ["Menguji", "2020–2026", "Kerusakan yang belum pernah dilihat model."],
    ],
    waktuCatatan:
      "Data PDRB BPS hanya ada untuk 2022–2025, jadi tidak dipakai agar informasi masa depan tidak ikut melatih model. IRBI 2024 disusun dengan informasi sampai 2024, sehingga perbandingan ini justru menguntungkan IRBI.",
    bisnisJudul: "Gunanya bagi bisnis reasuransi",
    bisnis: [
      ["Memantau penumpukan risiko", "Reasuradur perlu tahu di mana risiko gempa dari banyak polis menumpuk. Skor per kabupaten membantu menandai daerah dengan riwayat kerusakan tinggi."],
      ["Menyaring portofolio", "Sebelum menjalankan model katastrofe lengkap, indeks sederhana yang sudah diuji bisa dipakai untuk memilih daerah yang perlu dianalisis lebih rinci."],
      ["Satuan yang dekat dengan kerugian", "Skor dinyatakan dalam setara rumah hancur per tahun, sehingga lebih mudah dikaitkan ke kerugian (re)asuransi daripada skor tanpa satuan seperti IRBI."],
      ["Pelengkap, bukan pengganti", "Indeks ini tidak menghasilkan PML atau AAL dalam rupiah dan tidak memakai data polis atau klaim. Indeks ini dipakai berdampingan dengan model katastrofe dan zona tarif yang berlaku."],
    ],
  },
  en: {
    label: "About",
    judul: "How it works",
    pengantar:
      "Seven steps lead from raw damage records to the comparison with OJK tariff zones. Each step is a Python script that can be rerun from scratch, and every number on this site comes from those scripts.",
    tujuh: "Seven steps",
    masukan: "Input",
    keluaran: "Output",
    tahap: [
      {
        judul: "Match each damage record to its earthquake",
        masuk: "725 housing damage records (DIBI), USGS catalogue M ≥ 4, district boundaries",
        isi: "DIBI records damaged houses by district and date, but not which earthquake caused them. For each record, the matching looks for USGS earthquakes from two days before to one day after the reported date, within 300 km. If there are several, the one that shook the district hardest, judged by magnitude and distance, is chosen.",
        keluar: "705 records (97%) matched to 330 earthquakes. Padang 2009, Lombok 2018, Palu 2018, and Cianjur 2022 all matched correctly.",
      },
      {
        judul: "Build the earthquake × district dataset",
        masuk: "Output of step 1, BPS population and poverty data",
        isi: "DIBI only lists districts that reported damage, so the districts that were shaken but reported none are added with zero damage. Damage is converted to destroyed-house equivalents: 0.7 × heavy + 0.3 × moderate + 0.05 × light.",
        keluar: "70,247 earthquake-district pairs, 560 of them with damage. 2008-2019 is used for training and 2020-2026 for testing.",
      },
      {
        judul: "Estimate the weight of each factor",
        masuk: "Training data, 2008-2019",
        isi: "About 99% of pairs have no damage, while a few have thousands of damaged houses. A Negative Binomial model, a standard model for count data, handles this well. It shows how much magnitude, distance, depth, population, density, and poverty each matter. An XGBoost model serves as a benchmark.",
        keluar: "Magnitude, distance, and population matter most. On the test data the pair-level AUC is 0.965 (XGBoost: 0.939).",
      },
      {
        judul: "Score every district",
        masuk: "The model from step 3, USGS catalogue M ≥ 5 for 1973-2019",
        isi: "Aftershocks are removed first so one earthquake sequence is not counted several times. For each district, the expected damage from every main shock over 47 years is added up and divided by 47. The estimate for a single earthquake is capped at the number of houses in the district (population ÷ 4).",
        keluar: "Expected damage per year for 512 districts, using information up to 2019 only.",
      },
      {
        judul: "Test against damage in 2020-2026",
        masuk: "Houses damaged in 2020-2026, five benchmark indices",
        isi: "The NB-EAD score is compared with IRBI 2024, the OJK 2017 tariff zones, and three composite indices (equal weights, Entropy, CRITIC). The measures are AUC, rank correlation, precision in the top 50 districts, and the share of damage that falls in the top 10% of districts. Differences are checked with 2,000 random resamples, by district and by province.",
        keluar: "More accurate than IRBI and Entropy, slightly more accurate than the OJK zones, and on par with simple weights.",
      },
      {
        judul: "Group districts into five zones",
        masuk: "Risk score and shaking intensity",
        isi: "Districts are grouped into five zones, the same number as the OJK zones. SKATER forces every zone to be one connected area, while K-Means lets zones scatter. The two are then compared.",
        keluar: "The SKATER zones are connected, but the districts inside them are far less alike (R² 0.565 vs 0.876).",
      },
      {
        judul: "Compare with the OJK tariff zones",
        masuk: "NB-EAD risk classes 1-5, OJK zones I-V",
        isi: "Agreement between the NB-EAD classes and the OJK zones is measured with weighted Cohen's kappa, and the districts where they differ most are listed.",
        keluar: "Moderate agreement (κ = 0.60). In 3 districts the OJK zone is lower than the NB-EAD score suggests, and in 52 it is higher.",
      },
    ],
    waktuJudul: "No future data leaks into the model",
    waktu: [
      ["Shaking history", "1973-2019", "USGS M ≥ 5 catalogue with aftershocks removed."],
      ["Training", "2008-2019", "46,577 earthquake-district pairs, 231 with damage."],
      ["Testing", "2020-2026", "Damage the model has never seen."],
    ],
    waktuCatatan:
      "BPS regional GDP data only cover 2022-2025, so they were left out to keep future information out of training. IRBI 2024 was compiled with information up to 2024, which gives it an advantage in this comparison.",
    bisnisJudul: "Why it matters for reinsurance",
    bisnis: [
      ["Tracking accumulation", "A reinsurer needs to know where earthquake risk from many policies piles up. A district score helps flag places with a history of heavy damage."],
      ["Screening a portfolio", "Before running a full catastrophe model, a simple index that has been tested can point to the districts that deserve a closer look."],
      ["A unit close to losses", "The score is expressed in destroyed-house equivalents per year, which is easier to relate to (re)insurance losses than a unitless score like IRBI."],
      ["A complement, not a replacement", "The index does not produce PML or AAL in rupiah and does not use policy or claims data. It is meant to sit alongside catastrophe models and the tariff zones in force."],
    ],
  },
};

export default function Alur({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <Halaman label={t.label} judul={t.judul} pengantar={<p>{t.pengantar}</p>}>
      <Bagian judul={t.tujuh}>
        <ol className="relative space-y-4 border-l-2 border-base-300 pl-6">
          {t.tahap.map((x, i) => (
            <Reveal key={x.judul} delay={i * 0.04}>
              <li className="relative">
                <span className="absolute -left-[37px] top-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-content">{i + 1}</span>
                <div className="rounded-[1.25rem] border border-base-300 p-5">
                  <h3 className="font-semibold">{x.judul}</h3>
                  <p className="mt-1 text-sm text-base-content/60">
                    {t.masukan}: {x.masuk}
                  </p>
                  <p className="mt-3 text-base-content/80">{x.isi}</p>
                  <p className="mt-3 text-sm">
                    <span className="font-medium">{t.keluaran}:</span> {x.keluar}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </Bagian>

      <Bagian judul={t.waktuJudul}>
        <div className="grid gap-4 md:grid-cols-3">
          {t.waktu.map(([a, b, c], i) => (
            <div key={a} className={`rounded-[1.25rem] p-5 ${i === 2 ? "bg-primary text-primary-content" : "bg-base-200"}`}>
              <p className={`text-sm ${i === 2 ? "opacity-85" : "text-base-content/60"}`}>{a}</p>
              <p className="mt-1 text-lg font-semibold">{b}</p>
              <p className={`mt-2 text-sm ${i === 2 ? "opacity-90" : "text-base-content/75"}`}>{c}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm text-base-content/70">{t.waktuCatatan}</p>
      </Bagian>

      <Bagian judul={t.bisnisJudul}>
        <div className="grid gap-4 md:grid-cols-2">
          {t.bisnis.map(([a, b]) => (
            <div key={a} className="rounded-[1.25rem] border border-base-300 p-5">
              <h3 className="font-semibold">{a}</h3>
              <p className="mt-2 text-base-content/75">{b}</p>
            </div>
          ))}
        </div>
      </Bagian>
    </Halaman>
  );
}
