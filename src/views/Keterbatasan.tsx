import { Bagian, Halaman } from "@/components/Halaman";
import type { Lang } from "@/lib/i18n";

const T = {
  id: {
    label: "Tentang",
    judul: "Keterbatasan dan keterbukaan",
    pengantar: "Setiap penyederhanaan, asumsi, dan data yang dikurangi dicatat di sini supaya hasil penelitian ini bisa dinilai apa adanya.",
    lingkupJudul: "Batas cakupan",
    lingkup: [
      "Hanya guncangan gempa. Tsunami, tanah bergerak (likuifaksi), dan longsor tidak dihitung terpisah, padahal kerusakannya ikut tercatat di DIBI (misalnya Palu 2018).",
      "Satuan wilayah adalah kabupaten/kota (514, batas tahun 2020), tidak sampai kecamatan atau desa.",
      "Kerugian diukur dari jumlah rumah rusak, bukan nilai rupiah, klaim asuransi, korban jiwa, atau bangunan selain rumah.",
      "Data kerusakan 2008–2026; riwayat guncangan 1973–2019.",
      "Seluruhnya data publik, tanpa data eksposur, polis, atau klaim internal perusahaan.",
      "Hasilnya peringkat antar-daerah, bukan model katastrofe. Penelitian ini tidak menghasilkan PML atau AAL dan tidak bisa langsung dipakai untuk menetapkan harga.",
    ],
    kelompok: [
      {
        judul: "Keterbatasan data",
        isi: [
          "DIBI hanya mencatat kabupaten yang melapor kerusakan, dan sebagian kerusakan mungkin tidak dilaporkan. Kabupaten yang terguncang tetapi tidak tercatat dianggap tidak rusak.",
          "Jam kejadian di DIBI sering berisi nilai bawaan, jadi hanya tanggalnya yang dipakai.",
          "Pada gempa beruntun, kerusakan bisa terhitung dua kali: di Lombok Utara 2018 jumlah rumah rusak lebih banyak dari perkiraan jumlah rumah tangganya (1,34 kali).",
          "Kategori kerusakan tidak selalu diisi; beberapa kejadian besar mencatat nol rumah rusak sedang (misalnya Padang 2009).",
          "Katalog USGS tidak lengkap untuk gempa lokal kecil (di bawah M 4), jenis magnitudonya tidak diseragamkan, dan kelengkapan gempa M ≥ 5 tahun 1970-an belum dicek.",
          "Jumlah penduduk dihitung dari statistik kemiskinan (selisih 1–10% dari Sensus 2020). Indeks memakai kondisi sosial-ekonomi 2019 untuk semua kejadian.",
          "Jarak gempa diukur ke satu titik di dalam kabupaten, bukan ke pusat permukiman.",
          "Kabupaten hasil pemekaran setelah 2020 digabung ke induknya. Tiga kabupaten pemekaran 2014 diberi zona OJK kabupaten induknya.",
        ],
      },
      {
        judul: "Keterbatasan metode",
        isi: [
          "Kekuatan guncangan diperkirakan dengan rumus sederhana dari magnitudo dan jarak (M − 2·log₁₀ R), bukan model gerakan tanah atau ShakeMap. Pengaruh jenis tanah dan bentuk patahan tidak dihitung.",
          "Pencocokan DIBI–USGS memakai aturan sederhana; 32 pasangan yang tanggalnya di tepi rentang dan 119 yang jaraknya di atas 150 km belum diperiksa satu per satu.",
          "Bobot rusak 0,70 / 0,30 / 0,05 bersifat umum dan belum disesuaikan untuk rumah di Indonesia.",
          "Sekitar 99% data bernilai nol dan pseudo-R² model 0,222. Model khusus data nol berlebih dan pengaruh kedekatan wilayah belum diuji.",
          "Batas jumlah rumah memakai rata-rata nasional empat orang per rumah tangga.",
          "Metode pembuangan gempa susulan (Gardner–Knopoff) dikembangkan dari data California; gempa pendahuluan tetap dihitung.",
          "Model pembanding XGBoost tidak disetel. Komponen indeks pembanding dipilih oleh peneliti.",
          "Untuk SKATER, daerah di pulau berbeda dianggap bertetangga dengan 8 daerah terdekat, dan baru dua atribut yang dipakai.",
        ],
      },
      {
        judul: "Keterbatasan pengujian",
        isi: [
          "Periode uji pendek (7 tahun, 152 kabupaten rusak). Lokasi gempa berikutnya acak, jadi indeks yang dibuat sebelumnya hanya bisa menangkap kecenderungan jangka panjang.",
          "Data hanya dibagi satu kali (latih sampai 2019, uji mulai 2020). Pengujian berulang dengan beberapa titik potong belum dikerjakan.",
          "Uji ulang per provinsi belum memperhitungkan kemiripan antardaerah yang melewati batas provinsi.",
          "Zona OJK hanya punya lima nilai sehingga banyak daerah berperingkat sama; ini merugikan OJK pada ukuran berbasis peringkat.",
        ],
      },
    ],
    versiJudul: "Riwayat versi analisis",
    versiKet:
      "Data uji dipakai untuk tiga versi model. Setiap perubahan diputuskan dengan alasan ilmiah yang dicatat sebelum versi berikutnya diuji, dan setiap perubahan justru menurunkan hasil indeks NB-EAD. Model dibekukan pada versi 3. Data uji dipakai sekali lagi untuk menilai pembanding zona OJK tanpa mengubah model.",
    versi: [
      ["Riwayat guncangan", "2008–2019, semua gempa", "1973–2019, gempa utama", "1973–2019, gempa utama"],
      ["Bobot rusak berat / sedang / ringan", "1 / 0,5 / 0,25", "1 / 0,5 / 0,25", "0,70 / 0,30 / 0,05"],
      ["Korelasi peringkat indeks NB-EAD", "0,297", "0,270", "0,252"],
      ["AUC indeks NB-EAD", "0,678", "0,658", "0,647"],
    ],
    versiKolom: ["", "Versi 1", "Versi 2", "Versi 3 (utama)"],
    terbukaJudul: "Catatan keterbukaan",
    terbuka: [
      ["Tujuan dirumuskan ulang setelah melihat hasil.", " Rencana awalnya membuktikan bahwa bobot dari data lebih baik dari bobot sederhana. Karena hanya terbukti sebagian, sumbangan utama penelitian dirumuskan ulang menjadi cara menguji indeks beserta temuannya. Hipotesis awal tetap dilaporkan bersama hasilnya."],
      ["Penggunaan AI.", " Asisten AI (Claude, Anthropic) membantu mencari literatur, menulis kode, dan menyusun draf. Semua angka berasal dari skrip yang dijalankan ulang dari awal; penulis bertanggung jawab atas isinya."],
      ["Literatur.", " Pencarian hanya lewat OpenAlex, artikel akses terbuka 2024–2026. Klaim \"pertama\" berarti \"sejauh yang penulis temukan\"."],
      ["Belum dikerjakan:", " zonasi REDCap, pengujian dengan beberapa titik potong waktu, data bangunan per rumah, dan data klaim asuransi."],
    ],
  },
  en: {
    label: "About",
    judul: "Limitations and transparency",
    pengantar: "Every simplification, assumption, and piece of dropped data is recorded here, so readers can judge the results for what they are.",
    lingkupJudul: "Scope",
    lingkup: [
      "Earthquake shaking only. Tsunamis, liquefaction, and landslides are not modelled separately, even though DIBI includes their damage (Palu 2018, for example).",
      "The unit is the district (514 districts, 2020 boundaries), not sub-districts or villages.",
      "Losses are counted as damaged houses, not rupiah, insurance claims, casualties, or non-residential buildings.",
      "Damage data cover 2008-2026; the shaking history covers 1973-2019.",
      "Public data only, with no exposure, policy, or internal claims data.",
      "The output ranks districts and is not a catastrophe model. It does not produce PML or AAL and cannot be used directly for pricing.",
    ],
    kelompok: [
      {
        judul: "Data limitations",
        isi: [
          "DIBI only lists districts that reported damage, and some damage may go unreported. Districts that were shaken but not listed are treated as undamaged.",
          "Event times in DIBI are often default values, so only the date is used.",
          "Damage may be double counted in earthquake sequences: in North Lombok in 2018 the number of damaged houses exceeds the estimated number of households by a factor of 1.34.",
          "Damage categories are not always filled in; some large events report zero moderately damaged houses (Padang 2009, for example).",
          "The USGS catalogue misses small local earthquakes (below M 4), magnitude types are not harmonised, and the completeness of M ≥ 5 events in the 1970s has not been checked.",
          "Population is derived from poverty statistics (1-10% off the 2020 census). The index uses 2019 socio-economic conditions for every event.",
          "Distance is measured to one point inside each district, not to where people live.",
          "Districts created after 2020 are merged into their parent. Three districts created in 2014 take the OJK zone of their parent district.",
        ],
      },
      {
        judul: "Method limitations",
        isi: [
          "Shaking strength comes from a simple formula of magnitude and distance (M − 2·log₁₀ R), not a ground-motion model or ShakeMap. Soil type and fault geometry are ignored.",
          "Matching DIBI to USGS follows simple rules; 32 pairs at the edge of the date window and 119 pairs more than 150 km apart have not been checked one by one.",
          "The damage weights of 0.70 / 0.30 / 0.05 are generic and not calibrated for Indonesian houses.",
          "About 99% of the data are zeros and the model's pseudo-R² is 0.222. Zero-inflated models and spatial effects have not been tested.",
          "The cap on housing stock uses a national average of four people per household.",
          "The aftershock removal method (Gardner-Knopoff) was developed on California data; foreshocks are still counted.",
          "The XGBoost benchmark was not tuned. The components of the benchmark indices were chosen by the researcher.",
          "For SKATER, districts on different islands are linked to their 8 nearest neighbours, and only two attributes are used.",
        ],
      },
      {
        judul: "Testing limitations",
        isi: [
          "The test period is short (7 years, 152 damaged districts). Where the next earthquake strikes is random, so an index built in advance can only capture long-run tendencies.",
          "The data are split only once (training up to 2019, testing from 2020). Testing with several cut-off years has not been done.",
          "Resampling by province does not account for similarity between districts across provincial borders.",
          "The OJK zones have only five values, so many districts share a rank; this works against OJK on rank-based measures.",
        ],
      },
    ],
    versiJudul: "Version history of the analysis",
    versiKet:
      "The test data were used for three versions of the model. Each change was decided on scientific grounds written down before the next version was tested, and each change lowered the NB-EAD index's results. The model was frozen at version 3. The test data were used once more to evaluate the OJK zone benchmark, without changing the model.",
    versi: [
      ["Shaking history", "2008-2019, all events", "1973-2019, main shocks", "1973-2019, main shocks"],
      ["Weights for heavy / moderate / light damage", "1 / 0.5 / 0.25", "1 / 0.5 / 0.25", "0.70 / 0.30 / 0.05"],
      ["Rank correlation of the NB-EAD index", "0.297", "0.270", "0.252"],
      ["AUC of the NB-EAD index", "0.678", "0.658", "0.647"],
    ],
    versiKolom: ["", "Version 1", "Version 2", "Version 3 (main)"],
    terbukaJudul: "Transparency notes",
    terbuka: [
      ["The aim was reframed after seeing the results.", " The original plan was to show that data-driven weights beat simple ones. Because that held only partly, the main contribution became the testing framework and what it reveals about existing indices. The original hypothesis is still reported with its result."],
      ["Use of AI.", " An AI assistant (Claude, Anthropic) helped with the literature search, coding, and drafting. Every number comes from scripts rerun from scratch, and the author is responsible for the content."],
      ["Literature.", " The search covered OpenAlex only, limited to open-access articles from 2024-2026. Any claim to be \"first\" means \"first that the author found\"."],
      ["Not done yet:", " REDCap zoning, testing with several cut-off years, building-level exposure data, and insurance claims data."],
    ],
  },
};

export default function Keterbatasan({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <Halaman label={t.label} judul={t.judul} pengantar={<p>{t.pengantar}</p>}>
      <Bagian judul={t.lingkupJudul}>
        <ul className="list-disc space-y-2 pl-5 text-base-content/80">
          {t.lingkup.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Bagian>

      {t.kelompok.map((k) => (
        <Bagian key={k.judul} judul={k.judul}>
          <ul className="list-disc space-y-2 pl-5 text-base-content/80">
            {k.isi.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Bagian>
      ))}

      <Bagian judul={t.versiJudul} keterangan={t.versiKet}>
        <div className="overflow-x-auto rounded-[1.25rem] border border-base-300">
          <table className="table">
            <thead>
              <tr>
                {t.versiKolom.map((c, i) => (
                  <th key={i}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.versi.map(([a, ...b]) => (
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

      <Bagian judul={t.terbukaJudul}>
        <ul className="list-disc space-y-2 pl-5 text-base-content/80">
          {t.terbuka.map(([a, b]) => (
            <li key={a}>
              <strong>{a}</strong>
              {b}
            </li>
          ))}
        </ul>
      </Bagian>
    </Halaman>
  );
}
