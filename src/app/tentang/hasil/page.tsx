import type { Metadata } from "next";
import { Bagian, Halaman } from "@/components/Halaman";
import { DotPlot, Forest, GarisK } from "@/components/Grafik";
import { f, NAMA_INDEKS, R, validasi } from "@/lib/data";

export const metadata: Metadata = { title: "Hasil" };

const FITUR: Record<string, string> = {
  mag: "Magnitudo",
  log_hipo: "log₁₀ jarak hiposenter",
  log_depth: "log₁₀ kedalaman",
  log_penduduk: "log₁₀ penduduk",
  log_kepadatan: "log₁₀ kepadatan penduduk",
  p0_miskin: "Persentase penduduk miskin (P0)",
};

const SKENARIO: Record<string, string> = {
  UTAMA: "Utama",
  bobot_lama: "Bobot 1 / 0,5 / 0,25",
  hanya_RB: "Hanya rusak berat",
  negatif_p25: "Negatif S ≥ persentil-25",
  negatif_p50: "Negatif S ≥ persentil-50",
};

const PEMBANDING = ["IRBI 2024", "Zona tarif OJK 2017", "Bobot setara", "Entropy", "CRITIC"];

function forest(metrik: "auc_rusak" | "spearman") {
  return PEMBANDING.flatMap((p) =>
    [
      ["kabupaten", R.bootstrap_kab],
      ["blok provinsi", R.bootstrap_prov],
    ].map(([skema, src]) => {
      const r = (src as typeof R.bootstrap_kab).find((x) => x.pembanding === p && x.metrik === metrik)!;
      return { grup: NAMA_INDEKS[p] ?? p, skema: `bootstrap ${skema}`, est: r.selisih, lo: r.ci95_bawah, hi: r.ci95_atas, sig: r.signifikan };
    }),
  );
}

// Nilai signifikan tersimpan sebagai teks "+0.161*", yang lain sebagai angka.
const sel = (v: string | number) => (typeof v === "number" ? `${v >= 0 ? "+" : ""}${f(v)}` : v.replace(".", ","));

export default function Hasil() {
  const baris = (k: "auc_rusak" | "spearman") => validasi.map((v) => ({ label: v.label, nilai: v[k], sorot: v.indeks.startsWith("USULAN") }));
  const zm = Object.fromEntries(["SKATER", "K-Means"].map((n, i) => [n, R.zonasi_metrik[i]]));
  const kolomOjk = ["1", "2", "3", "4", "5"] as const;
  const maks = Math.max(...R.ojk_silang.flatMap((r) => kolomOjk.map((c) => r[c])));

  return (
    <Halaman
      label="Tentang"
      judul="Hasil"
      pengantar={<p>Semua angka berasal dari model versi 3 yang dibekukan pada 31 Oktober 2026 dan sudah diverifikasi dengan menjalankan ulang seluruh pipeline.</p>}
    >
      <Bagian id="model" judul="1. Faktor yang menjelaskan kerusakan (RM1)">
        <p className="max-w-3xl text-base-content/75">
          Koefisien model Negative Binomial pada data latih 2008–2019, dengan fitur terstandardisasi. IRR menunjukkan perubahan
          ekspektasi kerusakan untuk kenaikan satu simpangan baku.
        </p>
        <div className="mt-4 overflow-x-auto rounded-[1.25rem] border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Fitur</th>
                <th className="text-right">β</th>
                <th className="text-right">SE</th>
                <th className="text-right">p</th>
                <th className="text-right">IRR per 1 SD</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {R.nb_koef
                .filter((r) => r.var !== "const")
                .map((r) => (
                  <tr key={r.var}>
                    <td>{FITUR[r.var]}</td>
                    <td className="text-right">{f(r.koef)}</td>
                    <td className="text-right">{f(r.se)}</td>
                    <td className="text-right">{r.p < 0.001 ? "< 0,001" : f(r.p)}</td>
                    <td className="text-right">{r.irr_per_1sd < 0.01 ? f(r.irr_per_1sd, 4) : f(r.irr_per_1sd, 2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-base-content/70">
          α = 97,3; pseudo-R² McFadden = 0,222. Kerusakan naik tajam dengan magnitudo dan turun dengan jarak. Jumlah penduduk menaikkan
          kerusakan, sedangkan kepadatan yang lebih tinggi menurunkannya; dugaan bahwa bangunan perkotaan lebih baik belum dapat kami
          buktikan. Kemiskinan tidak signifikan pada model utama. Pada data uji tingkat pasangan 2020–2026, AUC NB{" "}
          {f(R.pasangan_uji[0].auc_rusak)} dan XGBoost {f(R.pasangan_uji[1].auc_rusak)}.
        </p>
      </Bagian>

      <Bagian id="validasi" judul="2. Validasi out-of-time 2020–2026 (RM2, H1)">
        <p className="max-w-3xl text-base-content/75">512 kabupaten/kota, 152 di antaranya mengalami kerusakan rumah pada periode uji.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <DotPlot judul="AUC: kemampuan membedakan kabupaten rusak vs tidak" baris={baris("auc_rusak")} domain={[0.45, 0.7]} acuan={0.5} acuanLabel="0,5 = acak" />
          <DotPlot judul="Korelasi Spearman dengan kerusakan aktual" baris={baris("spearman")} domain={[-0.05, 0.3]} acuan={0} acuanLabel="0 = tidak berkorelasi" />
        </div>
        <div className="mt-4 overflow-x-auto rounded-[1.25rem] border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Indeks</th>
                <th className="text-right">Spearman ρ</th>
                <th className="text-right">AUC</th>
                <th className="text-right">Presisi@50</th>
                <th className="text-right">Tangkap 10% teratas</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {validasi.map((v) => (
                <tr key={v.indeks} className={v.indeks.startsWith("USULAN") ? "font-semibold" : ""}>
                  <td>{v.label}</td>
                  <td className="text-right">{f(v.spearman)}</td>
                  <td className="text-right">{f(v.auc_rusak)}</td>
                  <td className="text-right">{f(v.presisi_top50, 2)}</td>
                  <td className="text-right">{f(v.tangkap_top10pct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Forest judul="Selisih AUC (usulan − pembanding), IK 95%" baris={forest("auc_rusak")} domain={[-0.15, 0.3]} />
          <Forest judul="Selisih Spearman (usulan − pembanding), IK 95%" baris={forest("spearman")} domain={[-0.2, 0.4]} />
        </div>
        <div className="prosa mt-4 max-w-3xl text-base-content/80">
          <p>
            <strong>H1 terbukti sebagian.</strong> Indeks usulan signifikan lebih baik dari IRBI 2024 dan pembobotan Entropy pada kedua
            skema bootstrap, dan lebih baik dari zona OJK hanya pada bootstrap kabupaten. Indeks usulan tidak signifikan lebih baik dari
            bobot setara maupun CRITIC.
          </p>
          <p>
            Porsi kerusakan yang tertangkap 10% teratas indeks usulan (0,030) justru lebih kecil dari beberapa pembanding: peringkat
            teratasnya didominasi kabupaten dengan riwayat guncangan besar yang tidak rusak pada 2020–2026. Sebanyak 62% bobot Entropy
            jatuh pada komponen bahaya, sehingga bobot yang ditentukan sebaran data belum tentu mengikuti kerusakan.
          </p>
        </div>
      </Bagian>

      <Bagian id="ketahanan" judul="3. Uji ketahanan">
        <p className="max-w-3xl text-base-content/75">Selisih AUC usulan − pembanding pada lima skenario asumsi (* signifikan, bootstrap kabupaten).</p>
        <div className="mt-4 overflow-x-auto rounded-[1.25rem] border border-base-300">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Skenario</th>
                <th className="text-right">AUC</th>
                {PEMBANDING.map((p) => (
                  <th key={p} className="text-right">
                    vs {NAMA_INDEKS[p] ?? p}
                  </th>
                ))}
                <th className="text-right">p (P0)</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {R.ketahanan.map((k) => (
                <tr key={k.skenario}>
                  <td>{SKENARIO[k.skenario]}</td>
                  <td className="text-right">{f(k.auc)}</td>
                  {PEMBANDING.map((p) => (
                    <td key={p} className="text-right">
                      {sel(k[`auc_vs_${p}` as keyof typeof k] as string | number)}
                    </td>
                  ))}
                  <td className="text-right">{f(k.p_p0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-base-content/70">
          Kesimpulan H1 sama di kelima skenario. Saat pasangan bernilai nol dibatasi pada kabupaten yang terguncang kuat, kemiskinan menjadi
          signifikan (p = 0,027 dan 0,004). Temuan ini kami laporkan sebagai eksploratif.
        </p>
      </Bagian>

      <Bagian id="zonasi" judul="4. Zonasi kontigu vs K-Means (RM3, H2)">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="overflow-x-auto rounded-[1.25rem] border border-base-300">
            <table className="table">
              <thead>
                <tr>
                  <th>k = 5</th>
                  <th className="text-right">SKATER</th>
                  <th className="text-right">K-Means</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                <tr>
                  <td>R² antar-zona</td>
                  <td className="text-right">{f(zm.SKATER.R2_antar_zona)}</td>
                  <td className="text-right">{f(zm["K-Means"].R2_antar_zona)}</td>
                </tr>
                <tr>
                  <td>Silhouette</td>
                  <td className="text-right">{f(zm.SKATER.silhouette)}</td>
                  <td className="text-right">{f(zm["K-Means"].silhouette)}</td>
                </tr>
                <tr>
                  <td>Fragmen terhubung (5 = seluruhnya kontigu)</td>
                  <td className="text-right">{zm.SKATER.total_fragmen}</td>
                  <td className="text-right">{zm["K-Means"].total_fragmen}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <GarisK data={R.zonasi_diagnostik} />
        </div>
        <p className="mt-4 max-w-3xl text-base-content/80">
          <strong>H2 ditolak untuk k = 5.</strong> SKATER menghasilkan zona yang menyatu tetapi kehilangan 0,31 R². Zona rendahnya
          menggabungkan seluruh Jawa, Bali, dan Nusa Tenggara, termasuk Lombok dan Cianjur, padahal zona itu memuat 101 dari 152
          kabupaten yang rusak 2020–2026. SKATER baru menyamai homogenitas K-Means k = 5 pada sekitar 30 zona. Lihat lapisan zonasi di
          halaman Peta.
        </p>
      </Bagian>

      <Bagian id="ojk" judul="5. Kesesuaian dengan zona tarif OJK 2017">
        <div className="grid gap-4 lg:grid-cols-2">
          <figure className="rounded-[1.25rem] border border-base-300 p-5">
            <figcaption className="font-medium">Jumlah kabupaten: kuintil indeks usulan × zona OJK</figcaption>
            <table className="mt-3 w-full table-fixed text-center text-sm tabular-nums">
              <thead>
                <tr className="text-base-content/60">
                  <th className="w-24 py-1 text-left font-normal">Kuintil</th>
                  {["I", "II", "III", "IV", "V"].map((z) => (
                    <th key={z} className="py-1 font-normal">
                      Zona {z}
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
                      const t = v / maks;
                      return (
                        <td key={c} className="p-0.5">
                          <div
                            className="rounded py-2"
                            style={{ background: `color-mix(in oklab, var(--viz-1) ${Math.round(t * 85)}%, var(--viz-surface))`, color: t > 0.55 ? "#fff" : undefined }}
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
            <p>
              Kesesuaian tergolong sedang: κ kuadratik {f(R.ojk_kesepakatan[0].kappa_kuadratik, 2)}, Spearman {f(R.ojk_kesepakatan[0].spearman, 2)}, dan
              kelas identik pada {Math.round(R.ojk_kesepakatan[0].persen_sama_persis * 100)}% kabupaten.
            </p>
            <p>
              Tiga kabupaten (Kolaka, Muna, Tarakan) berada di zona OJK ≤ II tetapi di dua kuintil indeks teratas. Lima puluh dua kabupaten,
              kebanyakan di pantai utara Jawa dan Jakarta, berada di zona OJK ≥ IV tetapi indeksnya rendah.
            </p>
            <div className="rounded-[1.25rem] bg-warning text-warning-content p-4 text-sm">
              Selisih ini tidak boleh dibaca sebagai tarif yang terlalu tinggi atau terlalu rendah. Indeks hanya mencerminkan guncangan
              merusak yang tercatat selama 47 tahun, sedangkan zona OJK berbasis bahaya probabilistik dan dapat memperhitungkan kondisi
              tanah serta kejadian langka, misalnya sesar di dekat Jakarta. Selisih ini menandai kabupaten yang layak ditinjau.
            </div>
          </div>
        </div>
      </Bagian>
    </Halaman>
  );
}
