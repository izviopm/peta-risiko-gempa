import { ArrowRight, ArrowUpRight, Info, Layers, Map as IkonPeta } from "lucide-react";
import Link from "next/link";
import Cincin from "@/components/Cincin";
import Reveal from "@/components/Reveal";
import { f, R, irbi, ojk, usulan, validasi } from "@/lib/data";

const ANGKA = [
  { nilai: "725", label: "Catatan kerusakan", ket: "DIBI BNPB, 2008–2026" },
  { nilai: "97%", label: "Cocok dengan USGS", ket: "705 catatan, 330 gempa" },
  { nilai: "512", label: "Kabupaten/kota", ket: "diindeks dari data ≤ 2019" },
  { nilai: "152", label: "Rusak 2020–2026", ket: "dipakai sebagai data uji" },
];

const TEMUAN = [
  { judul: "IRBI 2024 kurang tepat sebagai proxy kerusakan rumah", isi: "IRBI adalah indeks perencanaan penanggulangan bencana yang juga memuat kapasitas daerah, tidak dirancang untuk memprediksi lokasi kerusakan." },
  { judul: "Lebih baik dari IRBI dan Entropy", isi: "Selisihnya signifikan pada bootstrap kabupaten dan blok provinsi, serta pada lima skenario asumsi." },
  { judul: "Zona tarif OJK cukup informatif", isi: "Keunggulan indeks usulan atas zona OJK baru signifikan pada bootstrap tingkat kabupaten." },
  { judul: "Bobot sederhana hampir sama baiknya", isi: "Tidak signifikan berbeda dari bobot setara maupun CRITIC. Pemilihan komponen dan validasi lebih menentukan." },
];

export default function Beranda() {
  const vsIrbi = R.bootstrap_kab.find((b) => b.pembanding === "IRBI 2024" && b.metrik === "auc_rusak")!;
  const urut = [...validasi].sort((a, b) => b.auc_rusak - a.auc_rusak);
  const [lo, hi] = [0.45, 0.68];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-5">
      <section className="flex flex-col gap-8 py-10 sm:py-14 lg:flex-row lg:items-end lg:justify-between">
        <Reveal className="max-w-4xl flex-1">
          <span className="pil">Penelitian · 100% data publik · November 2026</span>
          <h1 className="prosa mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Apakah indeks risiko gempa menunjuk rumah yang kemudian rusak?
            <span className="mt-2 block text-2xl leading-snug text-base-content/50 sm:text-3xl">512 kabupaten/kota diuji pada kerusakan 2020–2026.</span>
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/peta" className="btn btn-primary btn-lg rounded-full px-8">
              Buka peta <ArrowRight className="size-5" aria-hidden />
            </Link>
            <Link href="/tentang/alur" className="btn btn-lg rounded-full border-base-300 bg-base-100">
              Alur penelitian
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="max-w-sm shrink-0">
          <p className="prosa text-base text-base-content/70">
            Indeks ekspektasi kerusakan tahunan dibangun dari data sampai 2019, lalu dibandingkan dengan IRBI 2024, zona tarif gempa OJK
            2017, dan tiga skema pembobotan lain pada kerusakan rumah yang benar-benar terjadi setelahnya.
          </p>
          <p className="mt-3 text-sm text-base-content/60">Izvio Prijaya Mumin · Divisi IT, PT Reasuransi MAIPARK Indonesia</p>
        </Reveal>
      </section>

      <section aria-label="Ringkasan hasil" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 [&>*]:min-w-0">
        <Reveal className="kartu flex flex-wrap items-center gap-6 p-6 lg:col-span-4">
          <Cincin nilai={usulan.auc_rusak} teks={f(usulan.auc_rusak)} label="AUC indeks usulan" />
          <div className="min-w-40 flex-1">
            <p className="font-semibold">Membedakan kabupaten rusak</p>
            <p className="mt-1 text-sm text-base-content/70">
              AUC 0,5 berarti setara tebakan acak. Spearman indeks usulan {f(usulan.spearman)}.
            </p>
            <Link href="/tentang/hasil#validasi" className="pil mt-3 hover:border-primary">
              Lihat validasi <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          {ANGKA.map((a, i) => (
            <Reveal key={a.label} delay={0.04 * (i + 1)} className="kartu p-5">
              <p className="text-sm text-base-content/65">{a.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{a.nilai}</p>
              <p className="mt-1 text-xs text-base-content/60">{a.ket}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="rounded-[var(--radius-box)] bg-primary p-6 text-primary-content md:col-span-2 lg:col-span-3">
          <p className="text-sm opacity-85">Selisih AUC vs IRBI 2024</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight">+{f(vsIrbi.selisih)}</p>
          <p className="mt-2 text-sm opacity-90">
            IK 95% {f(vsIrbi.ci95_bawah)} sampai {f(vsIrbi.ci95_atas)}. IRBI sendiri mencapai AUC {f(irbi.auc_rusak)}.
          </p>
          <Link href="/tentang/hasil" className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-base-100 px-4 text-sm font-medium text-base-content">
            Semua hasil <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>

        <Reveal delay={0.05} className="kartu p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">AUC enam indeks pada data uji</h2>
            <span className="pil">512 kab · 152 rusak</span>
          </div>
          <ul className="mt-6 space-y-3" aria-label="AUC per indeks">
            {urut.map((v) => {
              const sorot = v.indeks.startsWith("USULAN");
              const lebar = ((v.auc_rusak - lo) / (hi - lo)) * 100;
              return (
                <li key={v.indeks} className="grid grid-cols-[minmax(0,9rem)_1fr_3rem] items-center gap-3 text-sm">
                  <span className={sorot ? "font-semibold" : "text-base-content/75"}>{v.label}</span>
                  <span className="relative h-3 rounded-full bg-base-200" aria-hidden>
                    <span className="absolute inset-y-0 w-px bg-[var(--viz-axis)]" style={{ left: `${((0.5 - lo) / (hi - lo)) * 100}%` }} />
                    <span className={`absolute inset-y-0 left-0 rounded-full ${sorot ? "bg-[var(--viz-2)]" : "bg-[var(--viz-1)]"}`} style={{ width: `${lebar}%` }} />
                  </span>
                  <span className="text-right tabular-nums">{f(v.auc_rusak)}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-base-content/60">Garis tipis = AUC 0,5 (acak). Sumbu dimulai dari 0,45.</p>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col justify-between rounded-[var(--radius-box)] bg-neutral p-6 text-neutral-content lg:col-span-5">
          <div>
            <span className="grid size-11 place-items-center rounded-full bg-accent text-accent-content">
              <IkonPeta className="size-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Jelajahi 512 kabupaten/kota</h2>
            <p className="mt-2 text-sm opacity-80">
              Bandingkan indeks usulan dengan zona OJK, IRBI 2024, zonasi SKATER dan K-Means, serta kerusakan yang benar-benar terjadi.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/peta" className="btn rounded-full border-0 bg-accent text-accent-content hover:bg-accent/90">
              Buka peta <ArrowRight className="size-4" aria-hidden />
            </Link>
            <span className="inline-flex items-center gap-1.5 text-sm opacity-80">
              <Layers className="size-4" aria-hidden /> 7 lapisan
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="kartu p-6 md:col-span-2 lg:col-span-8">
          <h2 className="font-semibold">Temuan utama</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {TEMUAN.map((t, i) => (
              <li key={t.judul} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-base-200 text-sm font-semibold">{i + 1}</span>
                <div>
                  <p className="font-medium">{t.judul}</p>
                  <p className="mt-1 text-sm text-base-content/70">{t.isi}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-base-content/60">
            Zona OJK: AUC {f(ojk.auc_rusak)}. Bobot setara: AUC {f(validasi.find((v) => v.indeks === "Bobot setara")!.auc_rusak)}.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="rounded-[var(--radius-box)] bg-warning p-6 text-warning-content md:col-span-2 lg:col-span-4">
          <div className="flex items-center gap-2">
            <Info className="size-5" aria-hidden />
            <h2 className="font-semibold">Cara membaca</h2>
          </div>
          <p className="mt-3 text-sm">
            Indeks ini peringkat relatif dari riwayat guncangan merusak 1973–2019. Bukan prakiraan gempa, bukan nilai kerugian dalam rupiah,
            dan bukan dasar penetapan tarif. Kabupaten tanpa riwayat guncangan merusak belum tentu aman.
          </p>
          <Link href="/tentang/keterbatasan" className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline underline-offset-4">
            Semua keterbatasan <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
