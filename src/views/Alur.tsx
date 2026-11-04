import { Bagian, Halaman } from "@/components/Halaman";
import Reveal from "@/components/Reveal";
import type { Lang } from "@/lib/i18n";

const T = {
  id: {
    label: "Tentang",
    judul: "Alur penelitian",
    pengantar:
      "Delapan langkah dari catatan rumah rusak sampai pengujian pada empat periode. Setiap langkah dijalankan oleh skrip Python yang bisa diulang dari awal, dan aturan analisisnya dikunci lebih dulu dalam pra-registrasi.",
    langkah: "Delapan langkah",
    masukan: "Masukan",
    keluaran: "Hasil",
    tahap: [
      {
        judul: "Menghitung guncangan tiap gempa di tiap kabupaten",
        masuk: "Katalog gempa USGS, peta lempeng Slab2, peta jenis tanah Vs30, grid penduduk 1 km (GHS-POP)",
        isi: "Setiap gempa digolongkan menurut jenis sumbernya (kerak dangkal, antarlempeng, atau dalam lempeng) memakai peta lempeng Slab2. Guncangan tanah (PGA) lalu dihitung dengan sembilan model gerakan tanah yang dipakai seismolog, tiga untuk tiap jenis, dengan memperhitungkan jenis tanah. Guncangan satu kabupaten adalah rata-rata kotak 1 km di dalamnya, dengan bobot jumlah penduduk tiap kotak.",
        keluar: "Guncangan untuk 572.303 kotak berpenduduk, dirangkum per gempa dan kabupaten dalam radius 300 km.",
      },
      {
        judul: "Mencocokkan kerusakan dengan gempanya",
        masuk: "725 catatan rumah rusak (DIBI), katalog gempa USGS M ≥ 4",
        isi: "DIBI mencatat rumah rusak per kabupaten dan tanggal, tetapi tidak menyebut gempa penyebabnya. Untuk setiap catatan dicari gempa USGS dari dua hari sebelum sampai satu hari sesudah tanggal kejadian, lalu dipilih gempa yang guncangannya paling kuat di kabupaten itu.",
        keluar: "706 catatan (97%) cocok dengan 329 gempa. Gempa Padang 2009, Lombok 2018, Palu 2018, dan Cianjur 2022 terpasang dengan benar.",
      },
      {
        judul: "Menyusun data gempa × kabupaten",
        masuk: "Hasil langkah 1 dan 2, data penduduk dan kemiskinan BPS",
        isi: "Kabupaten yang ikut terguncang tetapi tidak tercatat rusak ditambahkan dengan nilai kerusakan nol. Jumlah rumah rusak diubah ke satuan setara rumah hancur: 0,7 × rusak berat + 0,3 × rusak sedang + 0,05 × rusak ringan.",
        keluar: "98.201 pasangan gempa–kabupaten, 561 di antaranya ada rumah rusak.",
      },
      {
        judul: "Mencari bobot setiap faktor",
        masuk: "Data latih tiap periode",
        isi: "Sebagian besar pasangan tidak punya rumah rusak, sementara sebagian kecil punya ribuan. Data seperti ini dimodelkan dengan Negative Binomial, model statistik untuk data hitungan. Faktornya: guncangan, jumlah penduduk, kepadatan, dan kemiskinan.",
        keluar: "Guncangan dan jumlah penduduk paling berpengaruh di semua periode.",
      },
      {
        judul: "Menghitung skor risiko tiap kabupaten",
        masuk: "Model langkah 4, gempa utama M ≥ 5 sejak 1973 sampai akhir periode latih",
        isi: "Gempa susulan dibuang lebih dulu supaya satu rangkaian gempa tidak dihitung berkali-kali. Perkiraan kerusakan dari semua gempa utama dijumlahkan lalu dibagi jumlah tahun. Perkiraan satu gempa dibatasi paling banyak sejumlah rumah yang ada (penduduk ÷ 4).",
        keluar: "Perkiraan kerusakan per tahun untuk 512 kabupaten/kota, disusun ulang untuk tiap periode.",
      },
      {
        judul: "Menguji pada empat periode",
        masuk: "Rumah rusak di periode uji, tujuh indeks pembanding",
        isi: "Skor NB-EAD dibandingkan dengan IRBI 2024, zona tarif OJK 2017, tiga indeks gabungan (bobot setara, Entropy, CRITIC), serta indeks penduduk saja dan bahaya saja. Ukuran utamanya AUC. Selisih antarindeks diuji ulang secara acak 2.000 kali per provinsi, dan batas kebermaknaan diperketat untuk tujuh perbandingan (koreksi Holm).",
        keluar: "Lebih tepat dari IRBI di keempat periode, tetapi tidak lebih tepat dari pembanding lain.",
      },
      {
        judul: "Memeriksa jumlah kerusakan dan guncangan",
        masuk: "Perkiraan kerusakan, ShakeMap USGS untuk 187 gempa",
        isi: "Jumlah kerusakan yang diperkirakan dibandingkan dengan yang terjadi, per kelas risiko. Guncangan model juga dibandingkan dengan ShakeMap, peta guncangan resmi USGS.",
        keluar: "Urutan daerahnya lumayan, tetapi jumlah kerusakannya meleset jauh. Guncangan model mirip ShakeMap, kecuali untuk gempa raksasa.",
      },
      {
        judul: "Mengelompokkan daerah ke lima zona",
        masuk: "Skor risiko dan guncangan periode terakhir",
        isi: "Daerah dikelompokkan ke lima zona, sama dengan jumlah zona OJK. SKATER memaksa setiap zona menyambung di peta, sedangkan K-Means membebaskan zona terpencar.",
        keluar: "Zona SKATER menyambung, tetapi isinya jauh kurang mirip satu sama lain (R² 0,732 vs 0,936).",
      },
    ],
    waktuJudul: "Empat periode uji",
    waktuKet: "Setiap periode hanya memakai data sebelum periode ujinya, jadi model tidak pernah melihat kerusakan yang dipakai untuk mengujinya.",
    waktu: [
      ["Periode 1", "Uji 2014–2016", "Belajar dari 2008–2013 · 44 kab/kota rusak"],
      ["Periode 2", "Uji 2017–2019", "Belajar dari 2008–2016 · 80 kab/kota rusak"],
      ["Periode 3", "Uji 2020–2022", "Belajar dari 2008–2019 · 73 kab/kota rusak"],
      ["Periode 4", "Uji 2023–2026", "Belajar dari 2008–2022 · 122 kab/kota rusak"],
    ],
    praJudul: "Aturan dikunci sebelum hasil dihitung",
    pra: [
      ["Pra-registrasi", "Data, model, ukuran, dan kapan hipotesis dianggap terbukti ditulis lebih dulu, lalu dikunci dengan commit Git bertanggal pada 4 November 2026. Sidik jari berkasnya dikirim lewat email pada hari yang sama sebagai bukti waktu."],
      ["Log perubahan", "Setiap perubahan sesudah penguncian dicatat beserta alasannya sebelum dijalankan. Ada satu penyimpangan, yaitu koreksi jarak untuk panjang patahan, dan versi aslinya tetap dilaporkan."],
      ["Penjajakan diberi label", "Analisis yang diputuskan sesudah melihat hasil, misalnya patahan searah palung, diberi label penjajakan dan tidak dipakai untuk membuktikan hipotesis."],
    ],
    bisnisJudul: "Gunanya bagi bisnis reasuransi",
    bisnis: [
      ["Memantau penumpukan risiko", "Reasuradur perlu tahu di mana risiko gempa dari banyak polis menumpuk. Skor per kabupaten yang sudah diuji membantu menandai daerah dengan riwayat kerusakan tinggi."],
      ["Menyaring portofolio", "Sebelum menjalankan model katastrofe lengkap, indeks sederhana yang sudah diuji bisa dipakai untuk memilih daerah yang perlu dianalisis lebih rinci."],
      ["Indeks sederhana cukup untuk mengurutkan", "Indeks gabungan dari bahaya dan jumlah penduduk sama baiknya dengan model kerusakan untuk mengurutkan daerah, asalkan diuji pada kerusakan nyata."],
      ["Pelengkap, bukan pengganti", "Jumlah kerusakan yang diperkirakan belum terkalibrasi, dan indeks ini tidak menghasilkan PML atau AAL dalam rupiah. Indeks ini dipakai berdampingan dengan model katastrofe dan zona tarif yang berlaku."],
    ],
  },
  en: {
    label: "About",
    judul: "How it works",
    pengantar:
      "Eight steps lead from raw damage records to tests on four periods. Each step is a Python script that can be rerun from scratch, and the analysis rules were locked in a preregistration before any test result was computed.",
    langkah: "Eight steps",
    masukan: "Input",
    keluaran: "Output",
    tahap: [
      {
        judul: "Compute the shaking from each earthquake in each district",
        masuk: "USGS earthquake catalogue, Slab2 plate model, Vs30 soil map, 1 km population grid (GHS-POP)",
        isi: "Each earthquake is classified by source type (shallow crustal, interface or intraslab) using the Slab2 plate model. Ground shaking (PGA) is then computed with nine ground motion models used by seismologists, three per source type, taking soil conditions into account. A district's shaking is the average over its 1 km cells, weighted by how many people live in each cell.",
        keluar: "Shaking for 572,303 populated cells, summarised per earthquake and district within 300 km.",
      },
      {
        judul: "Match each damage record to its earthquake",
        masuk: "725 housing damage records (DIBI), USGS catalogue M ≥ 4",
        isi: "DIBI records damaged houses by district and date, but not which earthquake caused them. For each record, the matching looks for USGS earthquakes from two days before to one day after the reported date and picks the one that shook the district hardest.",
        keluar: "706 records (97%) matched to 329 earthquakes. Padang 2009, Lombok 2018, Palu 2018 and Cianjur 2022 all matched correctly.",
      },
      {
        judul: "Build the earthquake × district dataset",
        masuk: "Output of steps 1 and 2, BPS population and poverty data",
        isi: "Districts that were shaken but reported no damage are added with zero damage. Damage is converted to destroyed-house equivalents: 0.7 × heavy + 0.3 × moderate + 0.05 × light.",
        keluar: "98,201 earthquake-district pairs, 561 of them with damage.",
      },
      {
        judul: "Estimate the weight of each factor",
        masuk: "Training data for each period",
        isi: "Most pairs have no damage, while a few have thousands of damaged houses. A Negative Binomial model, a standard model for count data, handles this. The factors are shaking, population, density and poverty.",
        keluar: "Shaking and population matter most in every period.",
      },
      {
        judul: "Score every district",
        masuk: "The model from step 4, M ≥ 5 main shocks from 1973 to the end of the training period",
        isi: "Aftershocks are removed first so one earthquake sequence is not counted several times. Expected damage from every main shock is added up and divided by the number of years. The estimate for a single earthquake is capped at the number of houses in the district (population ÷ 4).",
        keluar: "Expected damage per year for 512 districts, rebuilt for each period.",
      },
      {
        judul: "Test on four periods",
        masuk: "Houses damaged in each test period, seven benchmark indices",
        isi: "The NB-EAD score is compared with IRBI 2024, the OJK 2017 tariff zones, three composite indices (equal weights, Entropy, CRITIC), and population-only and hazard-only indices. The main measure is AUC. Differences are checked with 2,000 random resamples by province, and the significance bar is tightened for seven comparisons (Holm correction).",
        keluar: "More accurate than IRBI in all four periods, and no better than the other benchmarks.",
      },
      {
        judul: "Check damage totals and shaking",
        masuk: "Predicted damage, USGS ShakeMaps for 187 earthquakes",
        isi: "Predicted damage is compared with observed damage for each risk class. Modelled shaking is also compared with ShakeMap, the official USGS shaking map.",
        keluar: "The ranking is reasonable, but damage totals are far off. Modelled shaking matches ShakeMap except for giant earthquakes.",
      },
      {
        judul: "Group districts into five zones",
        masuk: "Risk score and shaking for the last period",
        isi: "Districts are grouped into five zones, the same number as the OJK zones. SKATER forces every zone to be one connected area, while K-Means lets zones scatter.",
        keluar: "The SKATER zones are connected, but the districts inside them are far less alike (R² 0.732 vs 0.936).",
      },
    ],
    waktuJudul: "Four test periods",
    waktuKet: "Each period uses only data from before its test window, so the model never sees the damage it is tested on.",
    waktu: [
      ["Period 1", "Test 2014-2016", "Trained on 2008-2013 · 44 damaged districts"],
      ["Period 2", "Test 2017-2019", "Trained on 2008-2016 · 80 damaged districts"],
      ["Period 3", "Test 2020-2022", "Trained on 2008-2019 · 73 damaged districts"],
      ["Period 4", "Test 2023-2026", "Trained on 2008-2022 · 122 damaged districts"],
    ],
    praJudul: "Rules locked before the results",
    pra: [
      ["Preregistration", "The data, model, measures and the conditions for accepting each hypothesis were written down first and locked in a dated Git commit on 4 November 2026. The file's hash was emailed the same day as a timestamp."],
      ["Change log", "Every change after the lock was logged with its reason before it was run. There is one deviation, a distance correction for rupture length, and the original version is still reported."],
      ["Exploratory work is labelled", "Analyses chosen after seeing the results, such as placing ruptures along the trench, are labelled exploratory and are not used to prove a hypothesis."],
    ],
    bisnisJudul: "Why it matters for reinsurance",
    bisnis: [
      ["Tracking accumulation", "A reinsurer needs to know where earthquake risk from many policies piles up. A tested district score helps flag places with a history of heavy damage."],
      ["Screening a portfolio", "Before running a full catastrophe model, a simple index that has been tested can point to the districts that deserve a closer look."],
      ["A simple index is enough for ranking", "A composite of hazard and population ranks districts as well as a fitted damage model, provided it is tested against real damage."],
      ["A complement, not a replacement", "Predicted damage totals are not calibrated, and the index does not produce PML or AAL in rupiah. It is meant to sit alongside catastrophe models and the tariff zones in force."],
    ],
  },
};

export default function Alur({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <Halaman label={t.label} judul={t.judul} pengantar={<p>{t.pengantar}</p>}>
      <Bagian judul={t.langkah}>
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

      <Bagian judul={t.waktuJudul} keterangan={t.waktuKet}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.waktu.map(([a, b, c]) => (
            <div key={a} className="rounded-[1.25rem] bg-base-200 p-5">
              <p className="text-sm text-base-content/60">{a}</p>
              <p className="mt-1 text-lg font-semibold">{b}</p>
              <p className="mt-2 text-sm text-base-content/75">{c}</p>
            </div>
          ))}
        </div>
      </Bagian>

      <Bagian judul={t.praJudul}>
        <div className="grid gap-4 md:grid-cols-3">
          {t.pra.map(([a, b], i) => (
            <div key={a} className={`rounded-[1.25rem] p-5 ${i === 0 ? "bg-primary text-primary-content" : "border border-base-300"}`}>
              <h3 className="font-semibold">{a}</h3>
              <p className={`mt-2 text-sm ${i === 0 ? "opacity-90" : "text-base-content/75"}`}>{b}</p>
            </div>
          ))}
        </div>
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
