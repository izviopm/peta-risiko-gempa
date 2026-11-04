import { ArrowUpRight, BarChart3, Database, ShieldAlert, Workflow } from "lucide-react";
import Link from "next/link";
import { Bagian, Halaman } from "@/components/Halaman";
import Reveal from "@/components/Reveal";
import { R } from "@/lib/data";
import { type Lang, rute } from "@/lib/i18n";

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

const T = {
  id: {
    judulNaskah:
      "Validasi Prediktif Rolling-Origin Terpra-registrasi Indeks Risiko Gempa Bumi Tingkat Kabupaten/Kota di Indonesia: IRBI, Zona Tarif OJK, dan Pembobotan Sederhana",
    label: "Tentang",
    judul: "Tentang penelitian ini",
    bagian: [
      { k: "alur" as const, judul: "Alur penelitian", isi: "Delapan langkah dari catatan rumah rusak sampai uji empat periode, pra-registrasi, dan gunanya bagi reasuransi.", Ikon: Workflow },
      { k: "dataset" as const, judul: "Dataset", isi: "Sepuluh sumber data publik, lisensinya, cara mengambilnya, dan data yang tidak dipakai.", Ikon: Database },
      { k: "hasil" as const, judul: "Hasil", isi: "Uji empat periode, uji hipotesis, faktor penyebab kerusakan, kalibrasi, perbandingan dengan ShakeMap, dan zonasi.", Ikon: BarChart3 },
      { k: "keterbatasan" as const, judul: "Keterbatasan", isi: "Batas cakupan, asumsi, riwayat versi analisis, penyimpangan dari rencana, dan catatan keterbukaan.", Ikon: ShieldAlert },
    ],
    penulis: "Penulis",
    afiliasi: "Divisi IT, PT Reasuransi MAIPARK Indonesia",
    versi: "Naskah versi 2.0 · 4 November 2026",
    kontribusi: "Kontribusi",
    kontribusiIsi: [
      "Uji indeks risiko gempa tingkat kabupaten/kota di Indonesia pada empat periode, dengan aturan analisis yang dikunci lebih dulu dan sepenuhnya dari data publik.",
      "Bukti bahwa IRBI 2024 tidak menunjuk lokasi rumah rusak akibat gempa di keempat periode.",
      "Bukti bahwa model kerusakan yang dilatih dari data tidak lebih baik dari pembobotan sederhana atas komponen yang sama, beserta penjelasannya.",
      "Pemeriksaan guncangan model terhadap ShakeMap USGS, termasuk kelemahan koreksi patahan sederhana untuk gempa raksasa.",
    ],
    istilahJudul: "Daftar istilah",
    istilahKet: "Arti istilah yang muncul di situs ini, dalam bahasa sehari-hari.",
    istilah: [
      ["Indeks NB-EAD", "Skor risiko yang disusun dalam penelitian ini: perkiraan jumlah rumah rusak per tahun di tiap kabupaten/kota, dihitung dari riwayat gempa dan model statistik. NB = Negative Binomial (model yang dipakai), EAD = expected annual damage (perkiraan kerusakan tahunan). Skor di peta memakai riwayat 1973–2019 dari analisis pendahuluan."],
      ["PGA dan model gerakan tanah", "PGA adalah percepatan tanah tertinggi saat gempa, dalam satuan g (gravitasi). Model gerakan tanah adalah rumus dari ribuan rekaman gempa yang memperkirakan PGA dari magnitudo, jarak, kedalaman, jenis sumber, dan jenis tanah."],
      ["ShakeMap", "Peta guncangan resmi USGS untuk tiap gempa, dibuat dari rekaman alat dan laporan warga. Dipakai untuk memeriksa guncangan model."],
      ["Setara rumah hancur", "Satuan kerusakan. Satu rumah rusak berat dihitung 0,7; rusak sedang 0,3; rusak ringan 0,05. Jadi 10 rumah rusak berat setara 7 rumah hancur."],
      ["Kelas 1–5", "512 daerah diurutkan menurut skor lalu dibagi lima kelompok sama besar. Kelas 5 berisi 20% daerah dengan skor tertinggi. Dalam statistik ini disebut kuintil."],
      ["AUC", "Peluang indeks memberi skor lebih tinggi pada daerah yang rusak dibanding daerah yang tidak rusak. 0,5 sama dengan tebakan acak, 1 berarti selalu benar."],
      ["Korelasi peringkat (Spearman)", "Seberapa mirip urutan daerah menurut indeks dengan urutan menurut kerusakan nyata. 0 berarti tidak ada hubungan, 1 berarti urutannya sama persis."],
      ["Uji empat periode (rolling-origin)", "Indeks dibangun dari data sebelum suatu periode, lalu diuji pada kerusakan di periode itu yang belum pernah dilihatnya. Ini diulang untuk empat periode berturut-turut, sehingga satu periode yang kebetulan tidak menentukan kesimpulan."],
      ["Pra-registrasi", "Rencana analisis yang ditulis dan dikunci sebelum hasil dihitung, supaya analisis tidak diubah-ubah sampai hasilnya terlihat bagus. Perubahan sesudahnya wajib dicatat beserta alasannya."],
      ["Kalibrasi", "Kecocokan antara jumlah kerusakan yang diperkirakan dan yang benar-benar terjadi. Indeks bisa mengurutkan daerah dengan baik tetapi tetap salah menebak jumlahnya."],
      ["Uji ulang acak (bootstrap)", "Data uji diambil ulang secara acak 2.000 kali untuk melihat apakah selisih antarindeks stabil. Pada uji per provinsi, satu provinsi diambil utuh karena daerah yang bertetangga cenderung mirip. Karena ada tujuh perbandingan, batas kebermaknaannya diperketat (koreksi Holm)."],
      ["Rentang keyakinan 95%", "Kisaran tempat selisih sebenarnya kemungkinan besar berada. Selisih disebut bermakna bila seluruh kisarannya di atas nol."],
      ["Negative Binomial", "Model statistik untuk data hitungan seperti jumlah rumah rusak, yang kebanyakan bernilai nol tetapi sesekali sangat besar."],
      ["Membuang gempa susulan", "Gempa susulan dikeluarkan dari katalog supaya satu rangkaian gempa tidak dihitung berkali-kali (metode Gardner–Knopoff)."],
      ["IRBI", "Indeks Risiko Bencana Indonesia dari BNPB, dipakai untuk perencanaan penanggulangan bencana."],
      ["Zona tarif gempa OJK", "Lima zona gempa (I sampai V) dalam SEOJK No. 6/SEOJK.05/2017 untuk tarif asuransi properti. Zona V paling berisiko."],
      ["SKATER dan K-Means", "Dua cara mengelompokkan daerah ke lima zona. SKATER memaksa setiap zona menyambung di peta; K-Means boleh membentuk zona yang terpencar."],
      ["Bobot setara, Entropy, CRITIC", "Tiga cara lain menggabungkan komponen bahaya, jumlah penduduk, kepadatan, dan kemiskinan menjadi satu skor, sebagai pembanding indeks NB-EAD. Penduduk saja dan bahaya saja adalah pembanding satu komponen."],
    ],
    penafian: "Penafian",
    penafianIsi:
      "Pandangan dan kesimpulan dalam penelitian ini milik penulis dan tidak mewakili sikap resmi PT Reasuransi MAIPARK Indonesia, BNPB, maupun OJK. Hasilnya berupa peringkat antar-daerah dari data historis. Hasil ini bukan ramalan gempa, bukan perkiraan kerugian dalam rupiah, dan bukan dasar penetapan tarif, underwriting, atau keputusan investasi.",
    konflik: "Konflik kepentingan dan pendanaan",
    konflikIsi:
      "Penulis bekerja di perusahaan reasuransi yang diawasi OJK dan bergerak di lini risiko gempa. Penelitian ini tidak memakai data eksposur, polis, klaim, maupun data internal perusahaan, dan tidak menerima pendanaan khusus.",
    ketersediaan: "Ketersediaan data dan kode",
    ketersediaanIsi: ["Seluruh data bersifat publik (lihat ", "Dataset", "). Pra-registrasi, log penyimpangan, dan skrip yang menghasilkan setiap angka bisa diminta dari penulis."],
    kutip: "Cara mengutip",
    kutipIsi: (j: string) => `I. P. Mumin, "${j}," naskah penelitian v2.0, PT Reasuransi MAIPARK Indonesia, Jakarta, 2026.`,
    pustaka: "Daftar pustaka",
  },
  en: {
    judulNaskah:
      "Preregistered Rolling-Origin Validation of District-Level Earthquake Risk Indices in Indonesia: IRBI, OJK Tariff Zones and Simple Weighting",
    label: "About",
    judul: "About this research",
    bagian: [
      { k: "alur" as const, judul: "How it works", isi: "Eight steps from raw damage records to the four-period tests, the preregistration, and why it matters for reinsurance.", Ikon: Workflow },
      { k: "dataset" as const, judul: "Data", isi: "Ten public data sources, their licences, how to get them, and what was left out.", Ikon: Database },
      { k: "hasil" as const, judul: "Results", isi: "Four-period tests, hypothesis tests, what drives damage, calibration, the ShakeMap check, and zoning.", Ikon: BarChart3 },
      { k: "keterbatasan" as const, judul: "Limitations", isi: "Scope, assumptions, the version history, deviations from the plan, and transparency notes.", Ikon: ShieldAlert },
    ],
    penulis: "Author",
    afiliasi: "IT Division, PT Reasuransi MAIPARK Indonesia",
    versi: "Paper version 2.0 · 4 November 2026",
    kontribusi: "Contributions",
    kontribusiIsi: [
      "A test of district-level earthquake risk indices in Indonesia over four periods, with the analysis rules locked in advance and only public data.",
      "Evidence that IRBI 2024 did not point to where earthquakes damaged houses in any of the four periods.",
      "Evidence that a damage model fitted to data does not beat simple weighting of the same components, and an explanation of why.",
      "A check of modelled shaking against USGS ShakeMap, which shows where a simple fault correction fails for giant earthquakes.",
    ],
    istilahJudul: "Glossary",
    istilahKet: "What the terms on this site mean, in plain language.",
    istilah: [
      ["NB-EAD index", "The risk score built in this study: the expected number of damaged houses per year in each district, calculated from earthquake history and a statistical model. NB stands for Negative Binomial, the model used, and EAD for expected annual damage. The map uses the 1973-2019 history from the preliminary analysis."],
      ["PGA and ground motion models", "PGA is the peak ground acceleration during an earthquake, measured in g (gravity). A ground motion model is a formula fitted to thousands of recordings that estimates PGA from magnitude, distance, depth, source type and soil."],
      ["ShakeMap", "The official USGS shaking map for each earthquake, built from instrument recordings and public reports. It is used to check the modelled shaking."],
      ["Destroyed-house equivalent", "The unit of damage. A heavily damaged house counts as 0.7, a moderately damaged one as 0.3, and a lightly damaged one as 0.05. Ten heavily damaged houses equal seven destroyed houses."],
      ["Class 1-5", "The 512 districts are sorted by score and split into five equal groups. Class 5 holds the 20% of districts with the highest scores. Statisticians call these quintiles."],
      ["AUC", "The chance that the index gives a damaged district a higher score than an undamaged one. 0.5 is a coin flip and 1 means it is always right."],
      ["Rank correlation (Spearman)", "How closely the order of districts by index matches their order by actual damage. 0 means no relationship and 1 means the order is identical."],
      ["Four-period test (rolling-origin)", "The index is built from data before a period and tested on damage in that period, which it has never seen. This is repeated for four consecutive periods, so one lucky period cannot decide the conclusion."],
      ["Preregistration", "An analysis plan written and locked before any result is computed, so the analysis cannot be adjusted until the numbers look good. Any later change must be logged with its reason."],
      ["Calibration", "How well the predicted amount of damage matches what actually happened. An index can rank districts well and still get the amount wrong."],
      ["Bootstrap resampling", "The test data are redrawn at random 2,000 times to see whether the gap between two indices holds up. In the province version, whole provinces are drawn together because neighbouring districts tend to be alike. With seven comparisons, the significance bar is tightened (Holm correction)."],
      ["95% confidence range", "The range where the true difference most likely lies. A difference counts as significant when the whole range sits above zero."],
      ["Negative Binomial", "A statistical model for counts such as the number of damaged houses, which are mostly zero but occasionally very large."],
      ["Removing aftershocks", "Aftershocks are taken out of the catalogue so that one earthquake sequence is not counted several times (Gardner-Knopoff method)."],
      ["IRBI", "Indonesia's official disaster risk index, published by BNPB for disaster management planning."],
      ["OJK earthquake tariff zones", "Five earthquake zones (I to V) set in OJK Circular No. 6/SEOJK.05/2017 for property insurance rates. Zone V is the riskiest."],
      ["SKATER and K-Means", "Two ways to group districts into five zones. SKATER forces every zone to be one connected area on the map; K-Means allows scattered zones."],
      ["Equal weights, Entropy, CRITIC", "Three other ways to combine hazard, population, density and poverty into one score. They serve as benchmarks for the NB-EAD index, along with the single-component population-only and hazard-only indices."],
    ],
    penafian: "Disclaimer",
    penafianIsi:
      "The views and conclusions in this research are the author's own and do not represent the official position of PT Reasuransi MAIPARK Indonesia, BNPB, or OJK. The results rank districts using historical data. They are not earthquake forecasts or loss estimates in rupiah, and they should not be used to set rates, make underwriting decisions, or guide investments.",
    konflik: "Conflict of interest and funding",
    konflikIsi:
      "The author works for a reinsurance company that is supervised by OJK and writes earthquake business. The research uses no exposure, policy, claims, or other internal company data, and received no dedicated funding.",
    ketersediaan: "Data and code availability",
    ketersediaanIsi: ["All data are public (see ", "Data", "). The preregistration, the deviation log and the scripts that produce every number are available from the author on request."],
    kutip: "How to cite",
    kutipIsi: (j: string) => `I. P. Mumin, "${j}," research paper v2.0, PT Reasuransi MAIPARK Indonesia, Jakarta, 2026.`,
    pustaka: "References",
  },
};

export default function Tentang({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <Halaman label={t.label} judul={t.judul} pengantar={<p>{t.judulNaskah}</p>}>
      <section aria-label={t.label} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.bagian.map(({ k, judul, isi, Ikon }, i) => (
          <Reveal key={k} delay={i * 0.05}>
            <Link
              href={rute(k, lang)}
              className="kartu group flex h-full flex-col p-6 transition-colors duration-200 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
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
          <p className="text-sm opacity-85">{t.penulis}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">Izvio Prijaya Mumin</p>
          <p className="mt-1 opacity-90">{t.afiliasi}</p>
          <p className="mt-6 text-sm opacity-85">{t.versi}</p>
        </Reveal>
        <Bagian judul={t.kontribusi} className="lg:col-span-7">
          <ol className="list-decimal space-y-2 pl-5 text-base-content/80">
            {t.kontribusiIsi.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </Bagian>
      </div>

      <Bagian id="istilah" judul={t.istilahJudul} keterangan={t.istilahKet}>
        <dl className="grid gap-3 md:grid-cols-2">
          {t.istilah.map(([k, v]) => (
            <div key={k} className="rounded-[1.25rem] bg-base-200 p-4">
              <dt className="font-semibold">{k}</dt>
              <dd className="mt-1 text-sm text-base-content/75">{v}</dd>
            </div>
          ))}
        </dl>
      </Bagian>

      <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        <Bagian judul={t.penafian}>
          <p className="text-base-content/80">{t.penafianIsi}</p>
        </Bagian>
        <Bagian judul={t.konflik}>
          <p className="text-base-content/80">{t.konflikIsi}</p>
        </Bagian>
        <Bagian judul={t.ketersediaan}>
          <p className="text-base-content/80">
            {t.ketersediaanIsi[0]}
            <Link href={rute("dataset", lang)} className="link">
              {t.ketersediaanIsi[1]}
            </Link>
            {t.ketersediaanIsi[2]}
          </p>
        </Bagian>
        <Bagian judul={t.kutip}>
          <pre className="whitespace-pre-wrap rounded-[1.25rem] bg-base-200 p-4 font-sans text-sm">{t.kutipIsi(t.judulNaskah)}</pre>
        </Bagian>
      </div>

      <Bagian id="pustaka" judul={`${t.pustaka} (${R.referensi.length})`}>
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
