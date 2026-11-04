import type { ReactNode } from "react";
import { Bagian, Halaman } from "@/components/Halaman";
import { DotPlot, Forest } from "@/components/Grafik";
import { auc, f, namaIndeks, R, USULAN } from "@/lib/data";
import type { Lang } from "@/lib/i18n";

/** PGA_pw Deli Serdang dari gempa Aceh 2004 (naskah v2 Tabel 9b); dihitung sekali dengan gmpe_v4.py. */
const DELI = { patahan: 0.527, jalur: 0.096, titik: 0.051 };
const GEO = ["patahan", "jalur", "titik"] as const;

const T = {
  id: {
    label: "Tentang",
    judul: "Hasil",
    pengantar:
      "Semua angka berasal dari naskah versi 2.0 (4 November 2026). Aturan analisisnya dikunci lebih dulu dalam pra-registrasi, lalu indeks diuji pada empat periode berturut-turut. Hasil yang kurang menguntungkan tetap ditampilkan.",
    s1: "1. Uji pada empat periode",
    s1Ket: (n: string) => `Setiap periode, model dan indeks dibangun ulang hanya dari data sebelum periode ujinya. Jumlah kabupaten/kota yang rusak per periode: ${n}.`,
    kolAuc: ["Indeks", "2014–16", "2017–19", "2020–22", "2023–26", "Rata-rata", "Korelasi peringkat"],
    dotJudul: "AUC rata-rata empat periode",
    dotAcuan: "0,5 = tebakan acak",
    s1Catatan:
      "AUC menunjukkan seberapa sering indeks memberi skor lebih tinggi pada daerah yang rusak dibanding yang tidak rusak. IRBI 2024 berada di sekitar tebakan acak di keempat periode. Bobot setara punya rata-rata tertinggi.",
    s2: "2. Uji hipotesis H1",
    s2Ket: "Selisih AUC rata-rata (indeks NB-EAD dikurangi pembanding) di empat periode, dengan rentang keyakinan 95% dari 2.000 uji ulang acak dan koreksi Holm untuk tujuh perbandingan.",
    forest: "Selisih AUC rata-rata, rentang keyakinan 95%",
    skemaProv: "uji ulang per provinsi",
    skemaKab: "uji ulang per kabupaten",
    kolH1: ["Pembanding", "Selisih", "p Holm", "Keputusan", "Versi sumber titik"],
    keputusan: { Didukung: "Terbukti", Indikatif: "Indikatif", "Tidak didukung": "Tidak terbukti" } as Record<string, string>,
    s2a: ["H1 hanya terbukti terhadap IRBI 2024.", " Indeks NB-EAD tidak lebih baik dari zona OJK, bobot setara, Entropy, CRITIC, penduduk saja, maupun bahaya saja. Pada uji ulang per kabupaten, bobot setara malah sedikit lebih baik dari indeks NB-EAD."],
    s2b: "IRBI adalah indeks perencanaan penanggulangan bencana yang juga menilai kapasitas daerah, dan tidak dirancang untuk menebak lokasi rumah rusak. Yang diuji di sini adalah kelayakannya sebagai ukuran potensi kerusakan rumah. Perbandingannya juga menguntungkan IRBI, karena IRBI 2024 disusun dengan informasi sesudah tiga periode uji pertama.",
    s3: "3. Faktor yang menentukan kerusakan",
    s3Ket: "Koefisien model Negative Binomial per periode latih (faktor sudah distandarkan; * = bermakna, p < 0,05).",
    kolKoef: ["Faktor", "Latih s.d. 2013", "s.d. 2016", "s.d. 2019", "s.d. 2022"],
    faktor: { log_pga: "Guncangan tanah (PGA, log)", log_penduduk: "Jumlah penduduk (log)", log_kepadatan: "Kepadatan penduduk (log)", p0: "Persentase penduduk miskin" } as Record<string, string>,
    barisModel: ["Pasangan latih (yang rusak)", "Pseudo-R²"],
    s3Catatan:
      "Guncangan dan jumlah penduduk berpengaruh kuat di semua periode. Pada jumlah penduduk yang sama, daerah yang lebih padat lebih sedikit rusak; dugaan bahwa bangunan kota lebih kokoh belum bisa dibuktikan. Pengaruh kemiskinan berganti arah antarperiode, jadi tidak ada bukti pengaruh yang stabil.",
    s4: "4. Apakah jumlah kerusakannya tepat? (kalibrasi)",
    s4Ket: "Kerusakan yang terjadi dibagi kerusakan yang diperkirakan, per kelas risiko (1 = sesuai, di bawah 1 = perkiraan terlalu besar).",
    kolKal: ["Kelas", "2014–16", "2017–19", "2020–22", "2023–26"],
    total: "Total diperkirakan / terjadi",
    s4Catatan:
      "Jumlah kerusakan yang diperkirakan meleset jauh: periode 2017–2019 terlalu kecil karena memuat gempa Lombok dan Palu 2018, sedangkan dua periode terakhir lebih dari 20 kali terlalu besar. Indeks NB-EAD layak dipakai untuk mengurutkan daerah, tetapi angka rumah rusak per tahunnya belum boleh dibaca sebagai perkiraan kerugian.",
    s5: "5. Apa yang membuat indeks bekerja (penjajakan)",
    s5Ket: "AUC rata-rata indeks NB-EAD bila satu pilihan analisis diubah. Bagian ini tidak dipakai untuk menguji ulang H1.",
    kolEks: ["Variasi", "Patahan (utama)", "Sumber titik", "Jenis gempa dari kedalaman", "Searah palung"],
    varian: {
      utama: "Model utama",
      "ablation: bahaya saja": "Hanya guncangan",
      "ablation: + penduduk": "Guncangan + penduduk",
      "ablation: + kepadatan": "Guncangan + penduduk + kepadatan",
      "model: NB hurdle": "Model hurdle",
      "bobot 1 / 0,5 / 0,25": "Bobot rusak 1 / 0,5 / 0,25",
      "hanya rusak berat": "Hanya rusak berat",
      "tau negatif persentil 25": "Nol hanya di daerah terguncang sedang",
      "tau negatif persentil 50": "Nol hanya di daerah terguncang kuat",
      "+ magnitudo": "Ditambah magnitudo",
    } as Record<string, string>,
    s5Catatan:
      "Guncangan dan jumlah penduduk sudah memuat hampir seluruh daya prediksi. Yang paling berpengaruh adalah asumsi daerah mana yang dianggap tidak rusak: bila nol hanya diberikan pada daerah yang terguncang cukup kuat, AUC naik sekitar 0,03. Bentuk model, bobot kerusakan, dan cara menggolongkan jenis gempa hampir tidak berpengaruh.",
    s6: "6. Guncangan model dibanding ShakeMap, dan masalah patahan",
    s6Ket: (n: number) => `Untuk ${n} gempa yang punya ShakeMap USGS, guncangan model dibandingkan dengan peta guncangan resmi itu (skala log; bias di atas 0 = model terlalu tinggi, 0,30 ≈ dua kali lipat).`,
    kolSm: ["Kelompok", "Pasangan", "Korelasi (patahan)", "Bias (patahan)", "Korelasi (titik)", "Bias (titik)"],
    subset: { semua: "Semua", "ShakeMap dengan observasi": "ShakeMap dengan rekaman/laporan", "kab rusak DIBI": "Kabupaten yang rusak" } as Record<string, string>,
    s6a:
      "Guncangan model sangat mirip ShakeMap. Masalahnya ada pada gempa raksasa. Koreksi patahan mengurangi jarak sebesar setengah panjang patahan ke segala arah, padahal patahan gempa subduksi memanjang searah palung laut. Untuk gempa Aceh 2004 (M 9,1), setengah panjangnya sekitar 425 km, sehingga daratan Sumatera Utara dianggap berada di atas patahan. Akibatnya Deli Serdang, Medan, Langkat, dan Simalungun menjadi daerah paling berisiko pada periode terakhir.",
    kolGeo: ["", "Patahan (utama)", "Searah palung (penjajakan)", "Sumber titik"],
    barisGeo: ["AUC per periode", "AUC rata-rata", "Selisih dengan bobot setara", "Bias vs ShakeMap, semua gempa", "Bias vs ShakeMap, M ≥ 7,5", "PGA Deli Serdang saat Aceh 2004"],
    s6b:
      "Percobaan penjajakan meletakkan patahan gempa subduksi searah palung. Guncangan gempa besar jadi paling dekat dengan ShakeMap dan sebagian besar daya prediksi kembali, tetapi indeks NB-EAD tetap tidak lebih baik dari bobot setara. Karena percobaan ini diputuskan sesudah hasil utama dilihat, angkanya tidak dipakai untuk menguji ulang H1. Versi utama tetap dilaporkan sesuai pra-registrasi.",
    s7: "7. Zona menyambung (SKATER) vs zona bebas (K-Means)",
    s7Ket: "Lima zona dari skor risiko dan guncangan periode terakhir (latih s.d. 2022).",
    kolZona: ["Lima zona", "SKATER", "K-Means"],
    zonaBaris: ["Kemiripan dalam zona (R²)", "Silhouette", "Jumlah bagian terpisah (5 = semua zona menyambung)", "Kemiripan dalam zona, versi sumber titik"],
    s7a: (a: string, b: string) => [
      "Hipotesis H2 ditolak.",
      ` Zona SKATER memang menyambung, tetapi kemiripan isinya turun ${a} (versi sumber titik: ${b}), jauh di atas batas 0,10 yang ditetapkan. Risiko gempa terlalu terlokalisasi untuk dibagi ke lima zona nasional yang wilayahnya harus menyambung.`,
    ],
  },
  en: {
    label: "About",
    judul: "Results",
    pengantar:
      "All numbers come from version 2.0 of the paper (4 November 2026). The analysis rules were locked in a preregistration first, and the index was then tested on four consecutive periods. Results that look bad for the index are reported too.",
    s1: "1. Tests on four periods",
    s1Ket: (n: string) => `For each period, the model and index are rebuilt from data before that period only. Districts with damage in each test period: ${n}.`,
    kolAuc: ["Index", "2014-16", "2017-19", "2020-22", "2023-26", "Mean", "Rank correlation"],
    dotJudul: "Mean AUC over four periods",
    dotAcuan: "0.5 = coin flip",
    s1Catatan:
      "AUC is how often an index gives a damaged district a higher score than an undamaged one. IRBI 2024 sits near a coin flip in all four periods. Equal weights has the highest mean.",
    s2: "2. Testing hypothesis H1",
    s2Ket: "Mean AUC difference (NB-EAD index minus benchmark) over the four periods, with 95% confidence ranges from 2,000 random resamples and a Holm correction for the seven comparisons.",
    forest: "Mean AUC difference, 95% confidence range",
    skemaProv: "resampled by province",
    skemaKab: "resampled by district",
    kolH1: ["Benchmark", "Difference", "Holm p", "Decision", "Point-source version"],
    keputusan: { Didukung: "Supported", Indikatif: "Indicative", "Tidak didukung": "Not supported" } as Record<string, string>,
    s2a: ["H1 holds only against IRBI 2024.", " The NB-EAD index is no better than the OJK zones, equal weights, Entropy, CRITIC, population only, or hazard only. When districts are resampled, equal weights comes out slightly ahead of the NB-EAD index."],
    s2b: "IRBI is a disaster planning index that also scores local capacity, and it was not built to predict where houses get damaged. What is tested here is its use as a measure of housing damage potential. The comparison also favours IRBI, because IRBI 2024 was compiled with information from after the first three test periods.",
    s3: "3. What drives damage",
    s3Ket: "Negative Binomial coefficients for each training period (standardised factors; * = significant, p < 0.05).",
    kolKoef: ["Factor", "Trained to 2013", "to 2016", "to 2019", "to 2022"],
    faktor: { log_pga: "Ground shaking (PGA, log)", log_penduduk: "Population (log)", log_kepadatan: "Population density (log)", p0: "Poverty rate" } as Record<string, string>,
    barisModel: ["Training pairs (damaged)", "Pseudo-R²"],
    s3Catatan:
      "Shaking and population have a strong effect in every period. For the same population, denser districts see less damage; better urban buildings could explain this, but the data cannot confirm it. The poverty effect changes direction between periods, so there is no evidence of a stable effect.",
    s4: "4. Does it get the amount of damage right? (calibration)",
    s4Ket: "Observed damage divided by predicted damage, by risk class (1 = correct, below 1 = the prediction is too high).",
    kolKal: ["Class", "2014-16", "2017-19", "2020-22", "2023-26"],
    total: "Total predicted / observed",
    s4Catatan:
      "Predicted damage totals are far off. The 2017-2019 period is too low because it includes the 2018 Lombok and Palu earthquakes, and the last two periods are more than 20 times too high. The NB-EAD index can rank districts, but its damaged houses per year should not be read as a loss estimate.",
    s5: "5. What makes the index work (exploratory)",
    s5Ket: "Mean AUC of the NB-EAD index when one analysis choice changes. These results are not used to retest H1.",
    kolEks: ["Variant", "Finite fault (main)", "Point source", "Source type from depth", "Along the trench"],
    varian: {
      utama: "Main model",
      "ablation: bahaya saja": "Shaking only",
      "ablation: + penduduk": "Shaking + population",
      "ablation: + kepadatan": "Shaking + population + density",
      "model: NB hurdle": "Hurdle model",
      "bobot 1 / 0,5 / 0,25": "Damage weights 1 / 0.5 / 0.25",
      "hanya rusak berat": "Heavy damage only",
      "tau negatif persentil 25": "Zeros only where shaking was moderate",
      "tau negatif persentil 50": "Zeros only where shaking was strong",
      "+ magnitudo": "Adding magnitude",
    } as Record<string, string>,
    s5Catatan:
      "Shaking and population carry nearly all of the predictive skill. The assumption about which districts count as undamaged matters most: when zeros are limited to districts that were shaken fairly hard, the AUC rises by about 0.03. Model form, damage weights and the way earthquakes are classified barely matter.",
    s6: "6. Modelled shaking against ShakeMap, and the fault problem",
    s6Ket: (n: number) => `For the ${n} earthquakes that have a USGS ShakeMap, modelled shaking is compared with that official shaking map (log scale; bias above 0 = the model is too high, 0.30 is about a factor of two).`,
    kolSm: ["Group", "Pairs", "Correlation (fault)", "Bias (fault)", "Correlation (point)", "Bias (point)"],
    subset: { semua: "All", "ShakeMap dengan observasi": "ShakeMaps with recordings or reports", "kab rusak DIBI": "Damaged districts" } as Record<string, string>,
    s6a:
      "Modelled shaking closely matches ShakeMap. The problem is with giant earthquakes. The fault correction shortens the distance by half the rupture length in every direction, while subduction ruptures actually run along the trench. For the 2004 Aceh earthquake (M 9.1) that half-length is about 425 km, so the North Sumatra mainland ends up on top of the fault. As a result, Deli Serdang, Medan, Langkat and Simalungun rank as the riskiest districts in the last period.",
    kolGeo: ["", "Finite fault (main)", "Along the trench (exploratory)", "Point source"],
    barisGeo: ["AUC by period", "Mean AUC", "Difference from equal weights", "Bias against ShakeMap, all events", "Bias against ShakeMap, M ≥ 7.5", "PGA at Deli Serdang, Aceh 2004"],
    s6b:
      "An exploratory run placed subduction ruptures along the trench. Shaking from large earthquakes then came closest to ShakeMap and most of the lost skill returned, but the NB-EAD index still did not beat equal weights. Because this run was decided after the main results were seen, it is not used to retest H1. The main version is still reported as preregistered.",
    s7: "7. Connected zones (SKATER) vs free zones (K-Means)",
    s7Ket: "Five zones built from the risk score and shaking of the last period (trained to 2022).",
    kolZona: ["Five zones", "SKATER", "K-Means"],
    zonaBaris: ["Similarity within zones (R²)", "Silhouette", "Separate pieces (5 = every zone connected)", "Similarity within zones, point-source version"],
    s7a: (a: string, b: string) => [
      "Hypothesis H2 is rejected.",
      ` The SKATER zones are connected, but their similarity drops by ${a} (point-source version: ${b}), well above the 0.10 limit set in advance. Earthquake risk is too localised to split into five national zones that must each be one connected area.`,
    ],
  },
};

function Tabel({ kolom, children, kecil }: { kolom: string[]; children: ReactNode; kecil?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-[1.25rem] border border-base-300">
      <table className={`table ${kecil ? "table-sm" : ""}`}>
        <thead>
          <tr>
            {kolom.map((c, i) => (
              <th key={i} className={i ? "text-right" : ""}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">{children}</tbody>
      </table>
    </div>
  );
}

export default function Hasil({ lang }: { lang: Lang }) {
  const t = T[lang];
  const n = (x: number | null, d = 3) => (x == null ? "–" : f(x, d, lang));
  const tanda = (x: number) => `${x > 0 ? "+" : ""}${n(x)}`;
  const urut = [...auc].sort((a, b) => b.rata2 - a.rata2);
  const forest = R.h1.flatMap((h) => [
    { grup: namaIndeks(h.pembanding, lang), skema: t.skemaProv, est: h.selisih, lo: h.prov[0], hi: h.prov[1], sig: h.prov[0] > 0 || h.prov[1] < 0 },
    { grup: namaIndeks(h.pembanding, lang), skema: t.skemaKab, est: h.selisih, lo: h.kab[0], hi: h.kab[1], sig: h.kab[0] > 0 || h.kab[1] < 0 },
  ]);
  const E = R.eksplorasi as Record<string, Record<string, number> | number[] | number>;
  const eks = (geo: string, v: string) => (E[geo] as Record<string, number>)[v];
  const B = R.bias_geometri;
  const z = R.zonasi;

  return (
    <Halaman label={t.label} judul={t.judul} pengantar={<p>{t.pengantar}</p>}>
      <Bagian id="validasi" judul={t.s1} keterangan={t.s1Ket(R.lipatan.map((l) => l.n_rusak).join(", "))}>
        <Tabel kolom={t.kolAuc}>
          {urut.map((v) => (
            <tr key={v.indeks} className={v.indeks === USULAN ? "font-semibold" : ""}>
              <td>{namaIndeks(v.indeks, lang)}</td>
              {v.lipatan.map((x, i) => (
                <td key={i} className="text-right">
                  {n(x)}
                </td>
              ))}
              <td className="text-right font-semibold">{n(v.rata2)}</td>
              <td className="text-right">{n(v.spearman_rata2)}</td>
            </tr>
          ))}
        </Tabel>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <DotPlot lang={lang} judul={t.dotJudul} baris={urut.map((v) => ({ label: namaIndeks(v.indeks, lang), nilai: v.rata2, sorot: v.indeks === USULAN }))} domain={[0.45, 0.7]} acuan={0.5} acuanLabel={t.dotAcuan} />
          <p className="self-center text-base-content/80">{t.s1Catatan}</p>
        </div>
      </Bagian>

      <Bagian id="h1" judul={t.s2} keterangan={t.s2Ket}>
        <div className="grid gap-4 lg:grid-cols-2">
          <Forest lang={lang} judul={t.forest} baris={forest} domain={[-0.15, 0.3]} />
          <div className="space-y-4">
            <Tabel kolom={t.kolH1} kecil>
              {R.h1.map((h) => (
                <tr key={h.pembanding}>
                  <td>{namaIndeks(h.pembanding, lang)}</td>
                  <td className="text-right">{tanda(h.selisih)}</td>
                  <td className="text-right">{n(h.p_holm, 2)}</td>
                  <td className={`text-right ${h.keputusan === "Didukung" ? "font-semibold" : ""}`}>{t.keputusan[h.keputusan]}</td>
                  <td className="text-right">
                    {tanda(h.titik_selisih)}, {t.keputusan[h.titik_keputusan].toLowerCase()}
                  </td>
                </tr>
              ))}
            </Tabel>
            <div className="prosa space-y-3 text-base-content/80">
              <p>
                <strong>{t.s2a[0]}</strong>
                {t.s2a[1]}
              </p>
              <p>{t.s2b}</p>
            </div>
          </div>
        </div>
      </Bagian>

      <Bagian id="model" judul={t.s3} keterangan={t.s3Ket}>
        <Tabel kolom={t.kolKoef}>
          {R.koef.map((k) => (
            <tr key={k.var}>
              <td>{t.faktor[k.var]}</td>
              {k.koef.map((x, i) => (
                <td key={i} className="text-right">
                  {n(x)}
                  {k.sig[i] ? "*" : ""}
                </td>
              ))}
            </tr>
          ))}
          <tr className="text-base-content/70">
            <td>{t.barisModel[0]}</td>
            {R.model.map((m) => (
              <td key={m.lipatan} className="text-right">
                {f(m.n_latih, 0, lang)} ({m.n_latih_rusak})
              </td>
            ))}
          </tr>
          <tr className="text-base-content/70">
            <td>{t.barisModel[1]}</td>
            {R.model.map((m) => (
              <td key={m.lipatan} className="text-right">
                {n(m.pseudo_r2)}
              </td>
            ))}
          </tr>
        </Tabel>
        <p className="mt-3 max-w-3xl text-sm text-base-content/70">{t.s3Catatan}</p>
      </Bagian>

      <Bagian id="kalibrasi" judul={t.s4} keterangan={t.s4Ket}>
        <Tabel kolom={t.kolKal}>
          {[0, 1, 2, 3, 4].map((i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              {R.kalibrasi.map((k) => (
                <td key={k.lipatan} className="text-right">
                  {n(k.rasio[i], 2)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="font-medium">
            <td>{t.total}</td>
            {R.kalibrasi.map((k) => (
              <td key={k.lipatan} className="whitespace-nowrap text-right">
                {f(k.perkiraan, 0, lang)} / {f(k.teramati, 0, lang)}
              </td>
            ))}
          </tr>
        </Tabel>
        <div className="mt-4 max-w-3xl rounded-[1.25rem] bg-warning p-4 text-sm text-warning-content">{t.s4Catatan}</div>
      </Bagian>

      <Bagian id="ketahanan" judul={t.s5} keterangan={t.s5Ket}>
        <Tabel kolom={t.kolEks} kecil>
          {Object.keys(t.varian).map((v) => (
            <tr key={v} className={v === "utama" ? "font-semibold" : ""}>
              <td>{t.varian[v]}</td>
              {["patahan", "titik", "kedalaman", "jalur"].map((g) => (
                <td key={g} className="text-right">
                  {n(eks(g, v))}
                  {g === "titik" && v === "model: NB hurdle" ? "†" : ""}
                </td>
              ))}
            </tr>
          ))}
        </Tabel>
        <p className="mt-2 text-xs text-base-content/60">{lang === "en" ? "† Fold 1 did not converge; mean of three periods." : "† Periode pertama gagal konvergen; rata-rata tiga periode."}</p>
        <p className="mt-3 max-w-3xl text-sm text-base-content/70">{t.s5Catatan}</p>
      </Bagian>

      <Bagian id="shakemap" judul={t.s6} keterangan={t.s6Ket(R.angka.shakemap_gempa)}>
        <Tabel kolom={t.kolSm} kecil>
          {R.shakemap.map((s) => (
            <tr key={s.subset}>
              <td>{t.subset[s.subset] ?? s.subset}</td>
              <td className="text-right">{f(s.n, 0, lang)}</td>
              <td className="text-right">{n(s.patahan_r_log10)}</td>
              <td className="text-right">{tanda(s.patahan_bias_log10)}</td>
              <td className="text-right">{n(s.titik_r_log10)}</td>
              <td className="text-right">{tanda(s.titik_bias_log10)}</td>
            </tr>
          ))}
        </Tabel>
        <p className="prosa mt-4 max-w-3xl text-base-content/80">{t.s6a}</p>
        <div className="mt-4">
          <Tabel kolom={t.kolGeo} kecil>
            <tr>
              <td>{t.barisGeo[0]}</td>
              {GEO.map((g) => (
                <td key={g} className="whitespace-nowrap text-right">
                  {(E[`${g}_lipatan`] as number[]).map((x) => n(x)).join(" · ")}
                </td>
              ))}
            </tr>
            <tr className="font-semibold">
              <td>{t.barisGeo[1]}</td>
              {GEO.map((g) => (
                <td key={g} className="text-right">
                  {n(eks(g, "utama"))}
                </td>
              ))}
            </tr>
            <tr>
              <td>{t.barisGeo[2]}</td>
              {GEO.map((g) => (
                <td key={g} className="text-right">
                  {tanda(E[`${g}_vs_setara`] as number)}
                </td>
              ))}
            </tr>
            <tr>
              <td>{t.barisGeo[3]}</td>
              {GEO.map((g) => (
                <td key={g} className="text-right">
                  {tanda(B[g].semua)}
                </td>
              ))}
            </tr>
            <tr>
              <td>{t.barisGeo[4]}</td>
              {GEO.map((g) => (
                <td key={g} className="text-right">
                  {tanda(B[g].besar)}
                </td>
              ))}
            </tr>
            <tr>
              <td>{t.barisGeo[5]}</td>
              {GEO.map((g) => (
                <td key={g} className="text-right">
                  {n(DELI[g])} g
                </td>
              ))}
            </tr>
          </Tabel>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-base-content/70">{t.s6b}</p>
      </Bagian>

      <Bagian id="zonasi" judul={t.s7} keterangan={t.s7Ket}>
        <div className="max-w-2xl">
          <Tabel kolom={t.kolZona}>
            <tr>
              <td>{t.zonaBaris[0]}</td>
              <td className="text-right">{n(z.SKATER.r2)}</td>
              <td className="text-right">{n(z["K-Means"].r2)}</td>
            </tr>
            <tr>
              <td>{t.zonaBaris[1]}</td>
              <td className="text-right">{n(z.SKATER.silhouette)}</td>
              <td className="text-right">{n(z["K-Means"].silhouette)}</td>
            </tr>
            <tr>
              <td>{t.zonaBaris[2]}</td>
              <td className="text-right">{z.SKATER.bagian}</td>
              <td className="text-right">{z["K-Means"].bagian}</td>
            </tr>
            <tr>
              <td>{t.zonaBaris[3]}</td>
              <td className="text-right">{n(z.SKATER.r2_titik)}</td>
              <td className="text-right">{n(z["K-Means"].r2_titik)}</td>
            </tr>
          </Tabel>
        </div>
        <p className="mt-4 max-w-3xl text-base-content/80">
          <strong>{t.s7a(n(z.penurunan), n(z.penurunan_titik))[0]}</strong>
          {t.s7a(n(z.penurunan), n(z.penurunan_titik))[1]}
        </p>
      </Bagian>
    </Halaman>
  );
}
