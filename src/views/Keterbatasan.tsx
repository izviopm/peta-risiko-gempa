import { Bagian, Halaman } from "@/components/Halaman";
import type { Lang } from "@/lib/i18n";

const T = {
  id: {
    label: "Tentang",
    judul: "Keterbatasan dan keterbukaan",
    pengantar: "Setiap penyederhanaan, asumsi, perubahan rencana, dan data yang dikurangi dicatat di sini supaya hasil penelitian ini bisa dinilai apa adanya.",
    lingkupJudul: "Batas cakupan",
    lingkup: [
      "Hanya guncangan gempa. Tsunami, tanah bergerak (likuifaksi), dan longsor tidak dihitung terpisah, padahal kerusakannya ikut tercatat di DIBI (misalnya Palu 2018).",
      "Satuan wilayah adalah kabupaten/kota (514, batas tahun 2020), tidak sampai kecamatan atau desa.",
      "Kerugian diukur dari jumlah rumah rusak, bukan nilai rupiah, klaim asuransi, korban jiwa, atau bangunan selain rumah.",
      "Seluruhnya data publik, tanpa data eksposur, polis, atau klaim internal perusahaan.",
      "Hasilnya peringkat antar-daerah, bukan model katastrofe. Penelitian ini tidak menghasilkan PML atau AAL dan tidak bisa langsung dipakai untuk menetapkan harga.",
      "Skor di peta berasal dari analisis pendahuluan (riwayat guncangan 1973–2019 dengan rumus guncangan sederhana). Skor versi utama naskah 2.0 tidak dipetakan karena masalah patahan yang dijelaskan di Hasil bagian 6.",
    ],
    kelompok: [
      {
        judul: "Keterbatasan data",
        isi: [
          "DIBI hanya mencatat kabupaten yang melapor kerusakan, dan sebagian kerusakan mungkin tidak dilaporkan. Kabupaten yang terguncang tetapi tidak tercatat dianggap tidak rusak, dan asumsi ini terbukti berpengaruh pada hasil.",
          "Dua pencocokan kemungkinan keliru: Sigi 2018 terpasang ke gempa M 5,8, bukan M 7,5, dan Kerinci 2009 ke gempa Padang. Kesalahan ini hanya memengaruhi data latih, bukan data uji.",
          "Pada gempa beruntun, kerusakan bisa terhitung dua kali, dan kategori kerusakan tidak selalu diisi.",
          "Katalog USGS tidak lengkap untuk gempa lokal kecil, dan jenis magnitudonya tidak diseragamkan.",
          "Jumlah penduduk kabupaten dihitung dari statistik kemiskinan, dan grid penduduk memakai satu tahun (2020) untuk semua periode.",
          "Kabupaten hasil pemekaran setelah 2020 digabung ke induknya; 17 kabupaten pemekaran 2012–2014 memakai data BPS tahun terdekat pada periode pertama.",
        ],
      },
      {
        judul: "Keterbatasan metode",
        isi: [
          "Koreksi patahan mengurangi jarak ke segala arah, padahal patahan gempa subduksi memanjang searah palung. Akibatnya guncangan gempa raksasa di daratan dilebih-lebihkan. Versi sumber titik justru meremehkan guncangan gempa besar.",
          "Guncangan yang dipakai adalah nilai tengah model, tanpa ketidakpastian antar-gempa dan dalam satu gempa. Pemilihan model gerakan tanah belum dicocokkan dengan dokumen peta bahaya nasional.",
          "Bobot rusak 0,70 / 0,30 / 0,05 bersifat umum dan belum disesuaikan untuk rumah di Indonesia.",
          "Batas jumlah rumah memakai rata-rata nasional empat orang per rumah tangga.",
          "Pengaruh provinsi sebagai efek acak tidak bisa diuji dengan pustaka yang dipakai.",
          "Untuk SKATER, daerah di pulau berbeda dianggap bertetangga dengan 8 daerah terdekat, dan baru dua atribut yang dipakai.",
        ],
      },
      {
        judul: "Keterbatasan pengujian",
        isi: [
          "Empat periode uji memakai data latih yang bertumpuk, jadi hasilnya tidak sepenuhnya independen.",
          "Hasil pendahuluan untuk 2020–2026 sudah dilihat sebelum pra-registrasi dibuat, jadi periode uji 3 dan 4 tidak sepenuhnya baru.",
          "Uji ulang per provinsi belum memperhitungkan kemiripan antardaerah yang melewati batas provinsi.",
          "IRBI 2024 dan zona OJK 2017 disusun sesudah periode uji awal, sehingga perbandingan itu menguntungkan keduanya.",
          "Zona OJK hanya punya lima nilai sehingga banyak daerah berperingkat sama; ini merugikan OJK pada ukuran berbasis peringkat.",
        ],
      },
    ],
    versiJudul: "Riwayat versi analisis",
    versiKet:
      "Tiga versi pendahuluan diuji pada satu periode (2020–2026) dan tidak dipublikasikan. Versi utama naskah 2.0 (model v4) disusun ulang dengan model gerakan tanah, diuji pada empat periode, dan aturannya dikunci lebih dulu.",
    versi: [
      ["Ukuran guncangan", "Rumus M − 2·log₁₀ R", "Rumus M − 2·log₁₀ R", "Rumus M − 2·log₁₀ R", "9 model gerakan tanah, jenis tanah, grid penduduk"],
      ["Periode uji", "2020–2026", "2020–2026", "2020–2026", "4 periode, 2014–2026"],
      ["Bobot rusak berat / sedang / ringan", "1 / 0,5 / 0,25", "1 / 0,5 / 0,25", "0,70 / 0,30 / 0,05", "0,70 / 0,30 / 0,05"],
      ["AUC indeks NB-EAD", "0,678", "0,658", "0,647", "0,632 (rata-rata)"],
      ["Aturan dikunci lebih dulu", "Tidak", "Tidak", "Tidak", "Ya (pra-registrasi)"],
    ],
    versiKolom: ["", "Pendahuluan 1", "Pendahuluan 2", "Pendahuluan 3", "Naskah 2.0"],
    terbukaJudul: "Catatan keterbukaan",
    terbuka: [
      ["Pra-registrasi.", " Rencana analisis dikunci dengan commit Git bertanggal pada 4 November 2026, dan sidik jari berkasnya dikirim lewat email ke alamat pribadi penulis pada hari yang sama. Ini bukti waktu, bukan saksi independen, dan rencana ini belum diunggah ke registri publik seperti OSF."],
      ["Satu penyimpangan.", " Sebelum hasil uji dihitung, pencocokan dengan sumber titik ternyata salah memasangkan kerusakan Palu 2018 ke gempa kecil. Koreksi jarak untuk panjang patahan lalu ditetapkan sebagai versi utama, dan versi sumber titik tetap dilaporkan."],
      ["Penjajakan sesudah hasil.", " Percobaan patahan searah palung diputuskan sesudah hasil utama dilihat, jadi diberi label penjajakan dan tidak dipakai untuk membuktikan hipotesis."],
      ["Penggunaan AI.", " Asisten AI (Claude, Anthropic) membantu mencari literatur, menulis kode, dan menyusun draf. Semua angka berasal dari skrip yang dijalankan sesuai pra-registrasi; penulis bertanggung jawab atas isinya."],
      ["Literatur.", " Penelusuran literatur masih terbatas. Klaim \"pertama\" berarti \"sejauh yang penulis temukan\"."],
      ["Belum dikerjakan:", " uji ulang pada data kerusakan sesudah 2026, geometri patahan yang lebih lengkap, data bangunan per rumah, dan data klaim asuransi."],
    ],
  },
  en: {
    label: "About",
    judul: "Limitations and transparency",
    pengantar: "Every simplification, assumption, change of plan and piece of dropped data is recorded here, so readers can judge the results for what they are.",
    lingkupJudul: "Scope",
    lingkup: [
      "Earthquake shaking only. Tsunamis, liquefaction and landslides are not modelled separately, even though DIBI includes their damage (Palu 2018, for example).",
      "The unit is the district (514 districts, 2020 boundaries), not sub-districts or villages.",
      "Losses are counted as damaged houses, not rupiah, insurance claims, casualties or non-residential buildings.",
      "Public data only, with no exposure, policy or internal claims data.",
      "The output ranks districts and is not a catastrophe model. It does not produce PML or AAL and cannot be used directly for pricing.",
      "The map scores come from the preliminary analysis (1973-2019 shaking history with a simple shaking formula). The main version 2.0 score is not mapped because of the fault problem explained in section 6 of the Results.",
    ],
    kelompok: [
      {
        judul: "Data limitations",
        isi: [
          "DIBI only lists districts that reported damage, and some damage may go unreported. Districts that were shaken but not listed are treated as undamaged, and this assumption turns out to affect the results.",
          "Two matches are probably wrong: Sigi 2018 was matched to an M 5.8 event instead of the M 7.5 mainshock, and Kerinci 2009 to the Padang event. These errors only affect the training data, not the test data.",
          "Damage may be double counted in earthquake sequences, and damage categories are not always filled in.",
          "The USGS catalogue misses small local earthquakes, and magnitude types are not harmonised.",
          "District population is derived from poverty statistics, and the population grid uses a single year (2020) for every period.",
          "Districts created after 2020 are merged into their parent; 17 districts created in 2012-2014 use the nearest available BPS year in the first period.",
        ],
      },
      {
        judul: "Method limitations",
        isi: [
          "The fault correction shortens distances in every direction, while subduction ruptures run along the trench. This overstates onshore shaking from giant earthquakes. The point-source version understates shaking from large events.",
          "Shaking is the median model value, without between-event or within-event variability. The choice of ground motion models has not been checked against the national hazard map documentation.",
          "The damage weights of 0.70 / 0.30 / 0.05 are generic and not calibrated for Indonesian houses.",
          "The cap on housing stock uses a national average of four people per household.",
          "Province random effects could not be tested with the software used.",
          "For SKATER, districts on different islands are linked to their 8 nearest neighbours, and only two attributes are used.",
        ],
      },
      {
        judul: "Testing limitations",
        isi: [
          "The four test periods share training data, so the results are not fully independent.",
          "The preliminary results for 2020-2026 had been seen before the preregistration was written, so test periods 3 and 4 are not fully new.",
          "Resampling by province does not account for similarity between districts across provincial borders.",
          "IRBI 2024 and the OJK 2017 zones were compiled after the early test periods, which favours them in those comparisons.",
          "The OJK zones have only five values, so many districts share a rank; this works against OJK on rank-based measures.",
        ],
      },
    ],
    versiJudul: "Version history of the analysis",
    versiKet:
      "Three unpublished preliminary versions were tested on a single period (2020-2026). The main version of paper 2.0 (model v4) was rebuilt with ground motion models, tested on four periods, and had its rules locked in advance.",
    versi: [
      ["Shaking measure", "Formula M − 2·log₁₀ R", "Formula M − 2·log₁₀ R", "Formula M − 2·log₁₀ R", "9 ground motion models, soil, population grid"],
      ["Test period", "2020-2026", "2020-2026", "2020-2026", "4 periods, 2014-2026"],
      ["Weights for heavy / moderate / light damage", "1 / 0.5 / 0.25", "1 / 0.5 / 0.25", "0.70 / 0.30 / 0.05", "0.70 / 0.30 / 0.05"],
      ["AUC of the NB-EAD index", "0.678", "0.658", "0.647", "0.632 (mean)"],
      ["Rules locked in advance", "No", "No", "No", "Yes (preregistration)"],
    ],
    versiKolom: ["", "Preliminary 1", "Preliminary 2", "Preliminary 3", "Paper 2.0"],
    terbukaJudul: "Transparency notes",
    terbuka: [
      ["Preregistration.", " The analysis plan was locked in a dated Git commit on 4 November 2026, and the file's hash was emailed to the author's personal address the same day. This is a timestamp, not an independent witness, and the plan has not yet been deposited in a public registry such as OSF."],
      ["One deviation.", " Before any test result was computed, point-source matching turned out to assign the 2018 Palu damage to a small earthquake. A distance correction for rupture length then became the main version, and the point-source version is still reported."],
      ["Exploration after the results.", " The run with ruptures along the trench was decided after the main results were seen, so it is labelled exploratory and is not used to prove a hypothesis."],
      ["Use of AI.", " An AI assistant (Claude, Anthropic) helped with the literature search, coding and drafting. Every number comes from scripts run as preregistered, and the author is responsible for the content."],
      ["Literature.", " The literature search is still limited. Any claim to be \"first\" means \"first that the author found\"."],
      ["Not done yet:", " a retest on damage data after 2026, a fuller fault geometry, building-level exposure data, and insurance claims data."],
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
                    <td key={i} className={i === 3 ? "font-semibold" : ""}>
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
