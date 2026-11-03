import { Bagian, Halaman } from "@/components/Halaman";
import { DotPlot, Forest, GarisK } from "@/components/Grafik";
import { f, namaIndeks, R, validasi } from "@/lib/data";
import type { Lang } from "@/lib/i18n";

const PEMBANDING = ["IRBI 2024", "Zona tarif OJK 2017", "Bobot setara", "Entropy", "CRITIC"];

const T = {
  id: {
    label: "Tentang",
    judul: "Hasil",
    pengantar: "Semua angka berasal dari model versi 3 yang dibekukan pada 31 Oktober 2026 dan sudah diperiksa dengan menjalankan ulang seluruh skrip dari awal.",
    fitur: { mag: "Magnitudo", log_hipo: "Jarak ke pusat gempa (log)", log_depth: "Kedalaman gempa (log)", log_penduduk: "Jumlah penduduk (log)", log_kepadatan: "Kepadatan penduduk (log)", p0_miskin: "Persentase penduduk miskin" } as Record<string, string>,
    skenario: { UTAMA: "Utama", bobot_lama: "Bobot rusak 1 / 0,5 / 0,25", hanya_RB: "Hanya rusak berat", negatif_p25: "Nol hanya di daerah terguncang sedang", negatif_p50: "Nol hanya di daerah terguncang kuat" } as Record<string, string>,
    s1: "1. Faktor yang menentukan kerusakan",
    s1Ket: "Hasil model Negative Binomial pada data 2008–2019. Kolom terakhir menunjukkan berapa kali lipat perkiraan kerusakan berubah bila faktor itu naik satu simpangan baku.",
    kolModel: ["Faktor", "Koefisien", "Galat baku", "p", "Kali lipat per 1 SD"],
    s1Catatan: (a: string, b: string) =>
      `Kerusakan naik tajam dengan magnitudo dan turun tajam dengan jarak. Makin banyak penduduk, makin banyak rumah rusak. Pada jumlah penduduk yang sama, daerah yang lebih padat justru lebih sedikit rusak; dugaan bahwa bangunan di kota lebih kokoh belum bisa dibuktikan. Kemiskinan tidak berpengaruh nyata pada model utama. Pada data uji per pasangan gempa–kabupaten 2020–2026, AUC model ini ${a} dan XGBoost ${b}.`,
    s2: "2. Hasil uji pada kerusakan 2020–2026",
    s2Ket: "512 kabupaten/kota, 152 di antaranya punya rumah rusak pada periode uji.",
    aucJudul: "AUC: seberapa baik membedakan daerah rusak dan tidak",
    aucAcuan: "0,5 = tebakan acak",
    spJudul: "Korelasi peringkat dengan kerusakan nyata",
    spAcuan: "0 = tidak berhubungan",
    kolValidasi: ["Indeks", "Korelasi peringkat", "AUC", "Tepat di 50 teratas", "Porsi kerusakan di 10% teratas"],
    forestAuc: "Selisih AUC (NB-EAD − pembanding), rentang keyakinan 95%",
    forestSp: "Selisih korelasi peringkat (NB-EAD − pembanding), rentang keyakinan 95%",
    skemaKab: "uji ulang per kabupaten",
    skemaProv: "uji ulang per provinsi",
    s2a: [
      "Hipotesis H1 terbukti sebagian.",
      " Indeks NB-EAD lebih tepat dari IRBI 2024 dan bobot Entropy pada kedua cara uji ulang, dan lebih tepat dari zona OJK hanya pada uji ulang per kabupaten. Indeks NB-EAD tidak terbukti lebih baik dari bobot setara maupun CRITIC.",
    ],
    s2b:
      "Porsi kerusakan yang jatuh di 10% daerah teratas indeks NB-EAD (0,030) justru lebih kecil dari beberapa pembanding. Penyebabnya, peringkat teratas diisi daerah dengan riwayat guncangan besar yang kebetulan tidak rusak pada 2020–2026. Sebanyak 62% bobot Entropy jatuh pada komponen bahaya, sehingga bobot yang ditentukan oleh sebaran data belum tentu mengikuti kerusakan.",
    s3: "3. Uji dengan asumsi berbeda",
    s3Ket: "Selisih AUC indeks NB-EAD terhadap tiap pembanding pada lima variasi asumsi (* = bermakna pada uji ulang per kabupaten).",
    kolKetahanan: (p: string) => `vs ${p}`,
    kolSkenario: ["Skenario", "AUC", "p kemiskinan"],
    s3Catatan:
      "Kesimpulannya sama di kelima skenario. Saat nilai nol hanya diberikan pada daerah yang terguncang cukup kuat, kemiskinan menjadi berpengaruh nyata (p = 0,027 dan 0,004). Temuan ini masih bersifat penjajakan.",
    s4: "4. Zona menyambung (SKATER) vs zona bebas (K-Means)",
    kolZona: ["Lima zona", "SKATER", "K-Means"],
    zonaBaris: ["Kemiripan dalam zona (R²)", "Silhouette", "Jumlah bagian terpisah (5 = semua zona menyambung)"],
    s4a: ["Hipotesis H2 ditolak untuk lima zona.", " Zona SKATER memang menyambung, tetapi kemiripan isinya turun 0,31. Zona rendah SKATER menggabungkan seluruh Jawa, Bali, dan Nusa Tenggara, termasuk Lombok dan Cianjur, padahal zona itu memuat 101 dari 152 daerah yang rusak pada 2020–2026. SKATER baru semirip K-Means lima zona bila zonanya sekitar 30. Lihat lapisan zona di halaman Peta."],
    s5: "5. Perbandingan dengan zona tarif OJK 2017",
    silang: "Jumlah kabupaten: kelas risiko NB-EAD × zona OJK",
    kelas: "Kelas",
    zona: "Zona",
    s5a: (k: string, s: string, p: number) => `Kesesuaiannya sedang: kappa berbobot ${k}, korelasi peringkat ${s}, dan kelas yang persis sama di ${p}% kabupaten.`,
    s5b: "Tiga kabupaten (Kolaka, Muna, Tarakan) ada di zona OJK I–II, padahal skor NB-EAD menempatkannya di dua kelas teratas. Sebaliknya, 52 kabupaten, kebanyakan di pantai utara Jawa dan Jakarta, ada di zona OJK IV–V meskipun skor NB-EAD-nya rendah.",
    s5c:
      "Selisih ini tidak berarti tarifnya terlalu tinggi atau terlalu rendah. Skor NB-EAD hanya merekam guncangan merusak selama 47 tahun, sedangkan zona OJK disusun dari peta bahaya yang memperhitungkan kemungkinan gempa besar yang jarang terjadi dan kondisi tanah, misalnya sesar di dekat Jakarta. Selisih ini hanya menandai daerah yang layak ditinjau.",
  },
  en: {
    label: "About",
    judul: "Results",
    pengantar: "Every number comes from version 3 of the model, frozen on 31 October 2026 and checked by rerunning all the scripts from scratch.",
    fitur: { mag: "Magnitude", log_hipo: "Distance to the hypocentre (log)", log_depth: "Earthquake depth (log)", log_penduduk: "Population (log)", log_kepadatan: "Population density (log)", p0_miskin: "Poverty rate" } as Record<string, string>,
    skenario: { UTAMA: "Main", bobot_lama: "Damage weights 1 / 0.5 / 0.25", hanya_RB: "Heavy damage only", negatif_p25: "Zeros only where shaking was moderate", negatif_p50: "Zeros only where shaking was strong" } as Record<string, string>,
    s1: "1. What drives damage",
    s1Ket: "Negative Binomial model fitted on 2008-2019 data. The last column shows how many times the expected damage changes when the factor rises by one standard deviation.",
    kolModel: ["Factor", "Coefficient", "Std. error", "p", "Change per 1 SD"],
    s1Catatan: (a: string, b: string) =>
      `Damage rises steeply with magnitude and falls steeply with distance. More people means more damaged houses. For the same population, denser districts see less damage; better urban buildings could explain this, but this cannot be proven. Poverty has no clear effect in the main model. On the 2020-2026 test pairs, the model reaches an AUC of ${a} and XGBoost ${b}.`,
    s2: "2. Test against damage in 2020-2026",
    s2Ket: "512 districts, 152 of which had damaged houses during the test period.",
    aucJudul: "AUC: how well each index separates damaged from undamaged districts",
    aucAcuan: "0.5 = coin flip",
    spJudul: "Rank correlation with actual damage",
    spAcuan: "0 = no relationship",
    kolValidasi: ["Index", "Rank correlation", "AUC", "Precision in top 50", "Share of damage in top 10%"],
    forestAuc: "Difference in AUC (NB-EAD − benchmark), 95% confidence range",
    forestSp: "Difference in rank correlation (NB-EAD − benchmark), 95% confidence range",
    skemaKab: "resampled by district",
    skemaProv: "resampled by province",
    s2a: [
      "Hypothesis H1 is partly supported.",
      " The NB-EAD index beats IRBI 2024 and Entropy weighting under both resampling schemes, and beats the OJK zones only when districts are resampled. It is not significantly better than equal weights or CRITIC.",
    ],
    s2b:
      "The share of damage that falls in the NB-EAD top 10% of districts (0.030) is lower than for some benchmarks. Its top ranks are filled with districts that have a history of strong shaking but happened to see no damage in 2020-2026. Entropy puts 62% of its weight on the hazard component, which shows that weights set by the spread of the data do not necessarily follow damage.",
    s3: "3. Tests under different assumptions",
    s3Ket: "Difference in AUC between the NB-EAD index and each benchmark under five alternative assumptions (* = significant when resampling districts).",
    kolKetahanan: (p: string) => `vs ${p}`,
    kolSkenario: ["Scenario", "AUC", "p poverty"],
    s3Catatan:
      "The conclusion is the same in all five scenarios. When zero damage is only assumed for districts that were shaken fairly hard, poverty becomes significant (p = 0.027 and 0.004). This is treated as exploratory.",
    s4: "4. Connected zones (SKATER) vs free zones (K-Means)",
    kolZona: ["Five zones", "SKATER", "K-Means"],
    zonaBaris: ["Similarity within zones (R²)", "Silhouette", "Separate pieces (5 = every zone connected)"],
    s4a: ["Hypothesis H2 is rejected for five zones.", " The SKATER zones are connected, but their similarity drops by 0.31. SKATER's low zone merges all of Java, Bali, and Nusa Tenggara, including Lombok and Cianjur, even though that zone holds 101 of the 152 districts damaged in 2020-2026. SKATER only matches five-zone K-Means at around 30 zones. See the zone layers on the Map page."],
    s5: "5. Comparison with the OJK 2017 tariff zones",
    silang: "Number of districts: NB-EAD risk class × OJK zone",
    kelas: "Class",
    zona: "Zone",
    s5a: (k: string, s: string, p: number) => `Agreement is moderate: weighted kappa ${k}, rank correlation ${s}, and the exact same class in ${p}% of districts.`,
    s5b: "Three districts (Kolaka, Muna, Tarakan) sit in OJK zones I-II although the NB-EAD score puts them in the top two classes. In the other direction, 52 districts, mostly on the north coast of Java and in Jakarta, sit in OJK zones IV-V despite low scores.",
    s5c:
      "These gaps do not mean the rates are too high or too low. The NB-EAD score only records damaging shaking over 47 years, while the OJK zones come from hazard maps that account for rare large earthquakes and ground conditions, such as faults near Jakarta. The gaps simply flag districts worth reviewing.",
  },
};

export default function Hasil({ lang }: { lang: Lang }) {
  const t = T[lang];
  const n = (x: number, d = 3) => f(x, d, lang);
  const baris = (k: "auc_rusak" | "spearman") => validasi.map((v) => ({ label: namaIndeks(v.indeks, lang), nilai: v[k], sorot: v.indeks.startsWith("USULAN") }));
  const forest = (metrik: "auc_rusak" | "spearman") =>
    PEMBANDING.flatMap((p) =>
      (
        [
          [t.skemaKab, R.bootstrap_kab],
          [t.skemaProv, R.bootstrap_prov],
        ] as const
      ).map(([skema, src]) => {
        const r = src.find((x) => x.pembanding === p && x.metrik === metrik)!;
        return { grup: namaIndeks(p, lang), skema, est: r.selisih, lo: r.ci95_bawah, hi: r.ci95_atas, sig: r.signifikan };
      }),
    );
  // Nilai signifikan tersimpan sebagai teks "+0.161*", yang lain sebagai angka.
  const sel = (v: string | number) => {
    const x = typeof v === "number" ? v : parseFloat(v);
    return `${x >= 0 ? "+" : ""}${n(x)}${typeof v === "string" && v.endsWith("*") ? "*" : ""}`;
  };
  const zm = { SKATER: R.zonasi_metrik[0], KMEANS: R.zonasi_metrik[1] };
  const kolomOjk = ["1", "2", "3", "4", "5"] as const;
  const maks = Math.max(...R.ojk_silang.flatMap((r) => kolomOjk.map((c) => r[c])));
  const kes = R.ojk_kesepakatan[0];

  return (
    <Halaman label={t.label} judul={t.judul} pengantar={<p>{t.pengantar}</p>}>
      <Bagian id="model" judul={t.s1} keterangan={t.s1Ket}>
        <div className="overflow-x-auto rounded-[1.25rem] border border-base-300">
          <table className="table">
            <thead>
              <tr>
                {t.kolModel.map((c, i) => (
                  <th key={c} className={i ? "text-right" : ""}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {R.nb_koef
                .filter((r) => r.var !== "const")
                .map((r) => (
                  <tr key={r.var}>
                    <td>{t.fitur[r.var]}</td>
                    <td className="text-right">{n(r.koef)}</td>
                    <td className="text-right">{n(r.se)}</td>
                    <td className="text-right">{r.p < 0.001 ? `< ${n(0.001)}` : n(r.p)}</td>
                    <td className="text-right">{r.irr_per_1sd < 0.01 ? n(r.irr_per_1sd, 4) : n(r.irr_per_1sd, 2)}×</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-base-content/70">
          α = {n(97.3, 1)}; pseudo-R² = {n(0.222)}. {t.s1Catatan(n(R.pasangan_uji[0].auc_rusak), n(R.pasangan_uji[1].auc_rusak))}
        </p>
      </Bagian>

      <Bagian id="validasi" judul={t.s2} keterangan={t.s2Ket}>
        <div className="grid gap-4 lg:grid-cols-2">
          <DotPlot lang={lang} judul={t.aucJudul} baris={baris("auc_rusak")} domain={[0.45, 0.7]} acuan={0.5} acuanLabel={t.aucAcuan} />
          <DotPlot lang={lang} judul={t.spJudul} baris={baris("spearman")} domain={[-0.05, 0.3]} acuan={0} acuanLabel={t.spAcuan} />
        </div>
        <div className="mt-4 overflow-x-auto rounded-[1.25rem] border border-base-300">
          <table className="table">
            <thead>
              <tr>
                {t.kolValidasi.map((c, i) => (
                  <th key={c} className={i ? "text-right" : ""}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {validasi.map((v) => (
                <tr key={v.indeks} className={v.indeks.startsWith("USULAN") ? "font-semibold" : ""}>
                  <td>{namaIndeks(v.indeks, lang)}</td>
                  <td className="text-right">{n(v.spearman)}</td>
                  <td className="text-right">{n(v.auc_rusak)}</td>
                  <td className="text-right">{n(v.presisi_top50, 2)}</td>
                  <td className="text-right">{n(v.tangkap_top10pct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Forest lang={lang} judul={t.forestAuc} baris={forest("auc_rusak")} domain={[-0.15, 0.3]} />
          <Forest lang={lang} judul={t.forestSp} baris={forest("spearman")} domain={[-0.2, 0.4]} />
        </div>
        <div className="prosa mt-4 max-w-3xl text-base-content/80">
          <p>
            <strong>{t.s2a[0]}</strong>
            {t.s2a[1]}
          </p>
          <p>{t.s2b}</p>
        </div>
      </Bagian>

      <Bagian id="ketahanan" judul={t.s3} keterangan={t.s3Ket}>
        <div className="overflow-x-auto rounded-[1.25rem] border border-base-300">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>{t.kolSkenario[0]}</th>
                <th className="text-right">{t.kolSkenario[1]}</th>
                {PEMBANDING.map((p) => (
                  <th key={p} className="text-right">
                    {t.kolKetahanan(namaIndeks(p, lang))}
                  </th>
                ))}
                <th className="text-right">{t.kolSkenario[2]}</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {R.ketahanan.map((k) => (
                <tr key={k.skenario}>
                  <td>{t.skenario[k.skenario]}</td>
                  <td className="text-right">{n(k.auc)}</td>
                  {PEMBANDING.map((p) => (
                    <td key={p} className="text-right">
                      {sel(k[`auc_vs_${p}` as keyof typeof k] as string | number)}
                    </td>
                  ))}
                  <td className="text-right">{n(k.p_p0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-base-content/70">{t.s3Catatan}</p>
      </Bagian>

      <Bagian id="zonasi" judul={t.s4}>
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="overflow-x-auto rounded-[1.25rem] border border-base-300">
            <table className="table">
              <thead>
                <tr>
                  {t.kolZona.map((c, i) => (
                    <th key={c} className={i ? "text-right" : ""}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tabular-nums">
                <tr>
                  <td>{t.zonaBaris[0]}</td>
                  <td className="text-right">{n(zm.SKATER.R2_antar_zona)}</td>
                  <td className="text-right">{n(zm.KMEANS.R2_antar_zona)}</td>
                </tr>
                <tr>
                  <td>{t.zonaBaris[1]}</td>
                  <td className="text-right">{n(zm.SKATER.silhouette)}</td>
                  <td className="text-right">{n(zm.KMEANS.silhouette)}</td>
                </tr>
                <tr>
                  <td>{t.zonaBaris[2]}</td>
                  <td className="text-right">{zm.SKATER.total_fragmen}</td>
                  <td className="text-right">{zm.KMEANS.total_fragmen}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <GarisK lang={lang} data={R.zonasi_diagnostik} />
        </div>
        <p className="mt-4 max-w-3xl text-base-content/80">
          <strong>{t.s4a[0]}</strong>
          {t.s4a[1]}
        </p>
      </Bagian>

      <Bagian id="ojk" judul={t.s5}>
        <div className="grid gap-4 lg:grid-cols-2">
          <figure className="rounded-[1.25rem] bg-base-200/60 p-5">
            <figcaption className="font-medium">{t.silang}</figcaption>
            <table className="mt-3 w-full table-fixed text-center text-sm tabular-nums">
              <thead>
                <tr className="text-base-content/60">
                  <th className="w-20 py-1 text-left font-normal">{t.kelas}</th>
                  {["I", "II", "III", "IV", "V"].map((z) => (
                    <th key={z} className="py-1 font-normal">
                      {t.zona} {z}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {R.ojk_silang.map((r) => (
                  <tr key={r["kelas EAD"]}>
                    <td className="py-0.5 text-left text-base-content/60">{r["kelas EAD"]}</td>
                    {kolomOjk.map((c) => {
                      const v = r[c];
                      const k = v / maks;
                      return (
                        <td key={c} className="p-0.5">
                          <div
                            className="rounded-lg py-2"
                            style={{ background: `color-mix(in oklab, var(--viz-1) ${Math.round(k * 85)}%, var(--viz-surface))`, color: k > 0.55 ? "var(--viz-surface)" : undefined }}
                          >
                            {v}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
          <div className="space-y-3 text-base-content/80">
            <p>{t.s5a(n(kes.kappa_kuadratik, 2), n(kes.spearman, 2), Math.round(kes.persen_sama_persis * 100))}</p>
            <p>{t.s5b}</p>
            <div className="rounded-[1.25rem] bg-warning p-4 text-sm text-warning-content">{t.s5c}</div>
          </div>
        </div>
      </Bagian>
    </Halaman>
  );
}
