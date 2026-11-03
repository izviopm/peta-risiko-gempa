import { ArrowRight, ArrowUpRight, BookOpen, Info, Layers, Map as IkonPeta } from "lucide-react";
import Link from "next/link";
import Cincin from "@/components/Cincin";
import PetaMini from "@/components/PetaMini";
import Reveal from "@/components/Reveal";
import { cari, f, namaIndeks, R, usulan, validasi } from "@/lib/data";
import { type Lang, rute } from "@/lib/i18n";

const T = {
  id: {
    pil: "Penelitian · 100% data publik · November 2026",
    judul: "Apakah indeks risiko gempa menunjuk daerah yang rumahnya kemudian rusak?",
    sub: "512 kabupaten/kota diuji pada kerusakan rumah 2020–2026.",
    intro:
      "Penelitian ini menyusun skor risiko gempa tiap kabupaten/kota hanya dari data sampai 2019. Skor itu lalu dicocokkan dengan rumah yang benar-benar rusak akibat gempa pada 2020–2026, dan dibandingkan dengan IRBI 2024 dari BNPB, zona tarif gempa OJK 2017, serta tiga cara pembobotan lain.",
    penulis: "Izvio Prijaya Mumin · Divisi IT, PT Reasuransi MAIPARK Indonesia",
    bukaPeta: "Buka peta",
    caraKerja: "Cara penelitiannya",
    angka: [
      { nilai: "725", label: "Catatan rumah rusak", ket: "DIBI BNPB, 2008–2026" },
      { nilai: "97%", label: "Berhasil dicocokkan ke gempanya", ket: "705 catatan, 330 gempa" },
      { nilai: "512", label: "Kabupaten/kota dinilai", ket: "skor dari data sampai 2019" },
      { nilai: "152", label: "Kabupaten/kota yang rusak", ket: "2020–2026, dipakai untuk menguji" },
    ],
    cincinLabel: "skor AUC",
    cincinJudul: "Seberapa tepat indeks NB-EAD",
    cincinIsi: (sp: string) =>
      `AUC menunjukkan seberapa sering indeks memberi skor lebih tinggi pada daerah yang rusak dibanding yang tidak. 0,5 berarti sama dengan tebakan acak, 1 berarti selalu benar. Korelasi peringkat (Spearman): ${sp}.`,
    lihatUji: "Lihat hasil uji",
    unggulJudul: "Keunggulan atas IRBI 2024",
    unggulIsi: (lo: string, hi: string, irbi: string) => `Selisih AUC. Rentang keyakinan 95%: ${lo} sampai ${hi}. AUC IRBI sendiri ${irbi}, setara tebakan acak.`,
    semuaHasil: "Semua hasil",
    aucJudul: "Skor AUC enam indeks",
    aucPil: "512 kab/kota · 152 rusak",
    aucCatatan: "Garis tipis menandai 0,5 (tebakan acak). Sumbu dimulai dari 0,45.",
    petaJudul: "Jelajahi 512 kabupaten/kota",
    petaIsi: "Lihat skor risiko tiap daerah, lalu bandingkan dengan zona OJK, IRBI 2024, hasil pengelompokan zona, dan kerusakan yang benar-benar terjadi.",
    lapisan: "7 lapisan peta",
    temuanJudul: "Temuan utama",
    temuan: [
      { judul: "IRBI 2024 kurang cocok untuk memperkirakan rumah rusak", isi: "IRBI adalah indeks perencanaan penanggulangan bencana yang juga menilai kapasitas daerah. IRBI tidak dirancang untuk menebak lokasi rumah yang akan rusak." },
      { judul: "Indeks NB-EAD lebih tepat dari IRBI dan bobot Entropy", isi: "Selisihnya tetap bermakna setelah diuji ulang secara acak 2.000 kali, baik per kabupaten maupun per provinsi, dan pada lima variasi asumsi." },
      { judul: "Zona tarif OJK cukup membantu", isi: "Zona OJK lebih baik dari tebakan acak. Indeks NB-EAD sedikit lebih tepat, tetapi selisihnya hanya bermakna pada uji per kabupaten." },
      { judul: "Bobot sederhana hampir sama baiknya", isi: "Indeks NB-EAD tidak terbukti lebih baik dari bobot setara maupun CRITIC. Yang paling menentukan adalah memilih komponen yang tepat dan mengujinya pada kerusakan nyata." },
    ],
    catatan: (ojk: string, setara: string) => `AUC zona OJK ${ojk}; bobot setara ${setara}.`,
    bacaJudul: "Cara membaca",
    bacaIsi:
      "Skor ini hanya peringkat antar-daerah berdasarkan riwayat guncangan merusak 1973–2019. Skor ini tidak meramalkan gempa, tidak menghitung kerugian dalam rupiah, dan tidak dipakai untuk menetapkan tarif asuransi. Daerah yang belum pernah terguncang kuat belum tentu aman.",
    istilah: "Daftar istilah",
    batasan: "Semua keterbatasan",
  },
  en: {
    pil: "Research · public data only · November 2026",
    judul: "Do earthquake risk indices point to the places where houses later get damaged?",
    sub: "512 Indonesian districts, tested against housing damage from 2020 to 2026.",
    intro:
      "This study builds an earthquake risk score for each district using only data up to 2019. The score is then checked against the houses that were actually damaged by earthquakes in 2020 to 2026, and compared with BNPB's IRBI 2024, the OJK 2017 earthquake tariff zones, and three other weighting methods.",
    penulis: "Izvio Prijaya Mumin · IT Division, PT Reasuransi MAIPARK Indonesia",
    bukaPeta: "Open the map",
    caraKerja: "How it works",
    angka: [
      { nilai: "725", label: "Damage records", ket: "DIBI (BNPB), 2008-2026" },
      { nilai: "97%", label: "Matched to an earthquake", ket: "705 records, 330 earthquakes" },
      { nilai: "512", label: "Districts scored", ket: "using data up to 2019" },
      { nilai: "152", label: "Districts with damage", ket: "2020-2026, used for testing" },
    ],
    cincinLabel: "AUC score",
    cincinJudul: "How accurate the NB-EAD index is",
    cincinIsi: (sp: string) =>
      `AUC is how often the index gives a damaged district a higher score than an undamaged one. 0.5 is a coin flip and 1 is always right. Rank correlation (Spearman): ${sp}.`,
    lihatUji: "See the test",
    unggulJudul: "Gain over IRBI 2024",
    unggulIsi: (lo: string, hi: string, irbi: string) => `Difference in AUC, with a 95% confidence range of ${lo} to ${hi}. IRBI on its own scores ${irbi}, about the same as guessing.`,
    semuaHasil: "All results",
    aucJudul: "AUC of six indices",
    aucPil: "512 districts · 152 damaged",
    aucCatatan: "The thin line marks 0.5 (a coin flip). The axis starts at 0.45.",
    petaJudul: "Explore 512 districts",
    petaIsi: "See the risk score for each district and compare it with the OJK zones, IRBI 2024, the zoning results, and the damage that actually happened.",
    lapisan: "7 map layers",
    temuanJudul: "Main findings",
    temuan: [
      { judul: "IRBI 2024 is a poor guide to where houses get damaged", isi: "IRBI is a disaster planning index that also scores local response capacity. It was not built to predict where houses will be damaged." },
      { judul: "The NB-EAD index beats IRBI and Entropy weighting", isi: "The gap holds after 2,000 random resamples, whether districts or whole provinces are resampled, and under five alternative assumptions." },
      { judul: "The OJK tariff zones carry useful information", isi: "The OJK zones do better than chance. The NB-EAD index is slightly more accurate, but the gap is only significant when districts are resampled." },
      { judul: "Simple weights do almost as well", isi: "The NB-EAD index is not significantly better than equal weights or CRITIC. Choosing sensible components and testing them on real damage matters more than the weighting method." },
    ],
    catatan: (ojk: string, setara: string) => `AUC of the OJK zones: ${ojk}. Equal weights: ${setara}.`,
    bacaJudul: "How to read this",
    bacaIsi:
      "The score ranks districts by their history of damaging shaking from 1973 to 2019. It does not forecast earthquakes, does not estimate losses in rupiah, and is not meant for setting insurance rates. A district that has not been shaken hard yet is not necessarily safe.",
    istilah: "Glossary",
    batasan: "All limitations",
  },
};

export default function Beranda({ lang }: { lang: Lang }) {
  const t = T[lang];
  const n = (x: number, d = 3) => f(x, d, lang);
  const vsIrbi = R.bootstrap_kab.find((b) => b.pembanding === "IRBI 2024" && b.metrik === "auc_rusak")!;
  const urut = [...validasi].sort((a, b) => b.auc_rusak - a.auc_rusak);
  const [lo, hi] = [0.45, 0.68];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-5">
      <section className="flex flex-col gap-8 py-10 sm:py-14 lg:flex-row lg:items-end lg:justify-between">
        <Reveal className="max-w-4xl flex-1">
          <span className="pil">{t.pil}</span>
          <h1 className="prosa mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {t.judul}
            <span className="mt-2 block text-2xl leading-snug text-base-content/50 sm:text-3xl">{t.sub}</span>
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={rute("peta", lang)} className="btn btn-primary btn-lg rounded-full px-8">
              {t.bukaPeta} <ArrowRight className="size-5" aria-hidden />
            </Link>
            <Link href={rute("alur", lang)} className="btn btn-lg rounded-full border-base-300 bg-base-100">
              {t.caraKerja}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="max-w-sm shrink-0">
          <p className="prosa text-base text-base-content/70">{t.intro}</p>
          <p className="mt-3 text-sm text-base-content/60">{t.penulis}</p>
        </Reveal>
      </section>

      <section aria-label={t.temuanJudul} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 [&>*]:min-w-0">
        <Reveal className="kartu flex flex-wrap items-center gap-6 p-6 lg:col-span-4">
          <Cincin nilai={usulan.auc_rusak} teks={n(usulan.auc_rusak)} label={t.cincinLabel} />
          <div className="min-w-40 flex-1">
            <p className="font-semibold">{t.cincinJudul}</p>
            <p className="mt-1 text-sm text-base-content/70">{t.cincinIsi(n(usulan.spearman))}</p>
            <Link href={`${rute("hasil", lang)}#validasi`} className="pil mt-3 hover:border-primary">
              {t.lihatUji} <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          {t.angka.map((a, i) => (
            <Reveal key={a.label} delay={0.04 * (i + 1)} className="kartu p-5">
              <p className="text-sm text-base-content/65">{a.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{a.nilai}</p>
              <p className="mt-1 text-xs text-base-content/60">{a.ket}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="rounded-[var(--radius-box)] bg-primary p-6 text-primary-content md:col-span-2 lg:col-span-3">
          <p className="text-sm opacity-85">{t.unggulJudul}</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight">+{n(vsIrbi.selisih)}</p>
          <p className="mt-2 text-sm opacity-90">{t.unggulIsi(n(vsIrbi.ci95_bawah), n(vsIrbi.ci95_atas), n(cari("IRBI 2024").auc_rusak))}</p>
          <Link href={rute("hasil", lang)} className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-base-100 px-4 text-sm font-medium text-base-content">
            {t.semuaHasil} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>

        <Reveal delay={0.05} className="kartu p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">{t.aucJudul}</h2>
            <span className="pil">{t.aucPil}</span>
          </div>
          <ul className="mt-6 space-y-3" aria-label={t.aucJudul}>
            {urut.map((v) => {
              const sorot = v.indeks.startsWith("USULAN");
              const lebar = ((v.auc_rusak - lo) / (hi - lo)) * 100;
              return (
                <li key={v.indeks} className="grid grid-cols-[minmax(0,10rem)_1fr_3rem] items-center gap-3 text-sm">
                  <span className={sorot ? "font-semibold" : "text-base-content/75"}>{namaIndeks(v.indeks, lang)}</span>
                  <span className="relative h-3 rounded-full bg-base-200" aria-hidden>
                    <span className="absolute inset-y-0 w-px bg-[var(--viz-axis)]" style={{ left: `${((0.5 - lo) / (hi - lo)) * 100}%` }} />
                    <span className={`absolute inset-y-0 left-0 rounded-full ${sorot ? "bg-[var(--viz-2)]" : "bg-[var(--viz-1)]"}`} style={{ width: `${lebar}%` }} />
                  </span>
                  <span className="text-right tabular-nums">{n(v.auc_rusak)}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-base-content/60">{t.aucCatatan}</p>
        </Reveal>

        <Reveal delay={0.1} className="kartu group relative flex flex-col overflow-hidden p-6 lg:col-span-5">
          <span className="grid size-11 place-items-center rounded-full bg-base-200 text-primary">
            <IkonPeta className="size-5" aria-hidden />
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">{t.petaJudul}</h2>
          <p className="mt-2 text-sm text-base-content/70">{t.petaIsi}</p>
          <Link href={rute("peta", lang)} className="mt-4 block rounded-[1.25rem] bg-base-200 p-4" aria-label={t.bukaPeta}>
            <PetaMini lang={lang} className="w-full transition-transform duration-300 ease-out group-hover:scale-[1.02]" />
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link href={rute("peta", lang)} className="btn btn-primary rounded-full">
              {t.bukaPeta} <ArrowRight className="size-4" aria-hidden />
            </Link>
            <span className="inline-flex items-center gap-1.5 text-sm text-base-content/65">
              <Layers className="size-4" aria-hidden /> {t.lapisan}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="kartu p-6 md:col-span-2 lg:col-span-8">
          <h2 className="font-semibold">{t.temuanJudul}</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {t.temuan.map((x, i) => (
              <li key={x.judul} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-base-200 text-sm font-semibold">{i + 1}</span>
                <div>
                  <p className="font-medium">{x.judul}</p>
                  <p className="mt-1 text-sm text-base-content/70">{x.isi}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-base-content/60">{t.catatan(n(cari("Zona tarif OJK 2017").auc_rusak), n(cari("Bobot setara").auc_rusak))}</p>
        </Reveal>

        <Reveal delay={0.1} className="rounded-[var(--radius-box)] bg-warning p-6 text-warning-content md:col-span-2 lg:col-span-4">
          <div className="flex items-center gap-2">
            <Info className="size-5" aria-hidden />
            <h2 className="font-semibold">{t.bacaJudul}</h2>
          </div>
          <p className="mt-3 text-sm">{t.bacaIsi}</p>
          <div className="mt-4 flex flex-wrap gap-x-5">
            <Link href={`${rute("tentang", lang)}#istilah`} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline underline-offset-4">
              <BookOpen className="size-4" aria-hidden /> {t.istilah}
            </Link>
            <Link href={rute("keterbatasan", lang)} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline underline-offset-4">
              {t.batasan} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
