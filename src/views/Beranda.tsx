import { ArrowRight, ArrowUpRight, BookOpen, Info, Layers, Map as IkonPeta } from "lucide-react";
import Link from "next/link";
import Cincin from "@/components/Cincin";
import PetaMini from "@/components/PetaMini";
import Reveal from "@/components/Reveal";
import { auc, cari, f, h1, namaIndeks, R, USULAN, usulan } from "@/lib/data";
import { type Lang, rute } from "@/lib/i18n";

const T = {
  id: {
    pil: "Penelitian · 100% data publik · pra-registrasi · November 2026",
    judul: "Apakah indeks risiko gempa menunjuk daerah yang rumahnya kemudian rusak?",
    sub: "512 kabupaten/kota diuji pada kerusakan rumah di empat periode, 2014–2026.",
    intro:
      "Penelitian ini menyusun skor risiko gempa tiap kabupaten/kota dari data sebelum periode uji, lalu mencocokkannya dengan rumah yang benar-benar rusak sesudahnya. Pengujian diulang pada empat periode dan dibandingkan dengan IRBI 2024 dari BNPB, zona tarif gempa OJK 2017, dan lima cara lain menyusun indeks.",
    penulis: "Izvio Prijaya Mumin · Divisi IT, PT Reasuransi MAIPARK Indonesia",
    bukaPeta: "Buka peta",
    caraKerja: "Cara penelitiannya",
    angka: (a: { dibi: number; cocok: number; gempa_cocok: number }, rusak: number) => [
      { nilai: String(a.dibi), label: "Catatan rumah rusak", ket: "DIBI BNPB, 2008–2026" },
      { nilai: `${Math.round((a.cocok / a.dibi) * 100)}%`, label: "Berhasil dicocokkan ke gempanya", ket: `${a.cocok} catatan, ${a.gempa_cocok} gempa` },
      { nilai: "512", label: "Kabupaten/kota dinilai", ket: "skor disusun ulang tiap periode" },
      { nilai: "4", label: "Periode uji", ket: `2014–2026, ${rusak} kab/kota-periode rusak` },
    ],
    cincinLabel: "AUC rata-rata",
    cincinJudul: "Seberapa tepat indeks NB-EAD",
    cincinIsi: (sp: string) =>
      `AUC menunjukkan seberapa sering indeks memberi skor lebih tinggi pada daerah yang rusak dibanding yang tidak. 0,5 berarti tebakan acak, 1 berarti selalu benar. Angka ini rata-rata empat periode uji; korelasi peringkatnya ${sp}.`,
    lihatUji: "Lihat hasil uji",
    unggulJudul: "Keunggulan atas IRBI 2024",
    unggulIsi: (lo: string, hi: string, irbi: string) => `Selisih AUC rata-rata empat periode, rentang keyakinan 95% ${lo} sampai ${hi}. AUC IRBI sendiri ${irbi}, setara tebakan acak.`,
    semuaHasil: "Semua hasil",
    aucJudul: "AUC rata-rata delapan indeks",
    aucPil: "512 kab/kota · 4 periode",
    aucCatatan: "Garis tipis menandai 0,5 (tebakan acak). Sumbu dimulai dari 0,45.",
    petaJudul: "Jelajahi 512 kabupaten/kota",
    petaIsi: "Lihat skor risiko tiap daerah, lalu bandingkan dengan zona OJK, IRBI 2024, hasil pengelompokan zona, dan kerusakan yang benar-benar terjadi. Skor di peta berasal dari analisis pendahuluan.",
    lapisan: "7 lapisan peta",
    temuanJudul: "Temuan utama",
    temuan: [
      { judul: "IRBI 2024 tidak menunjuk lokasi rumah rusak", isi: "Di keempat periode, AUC IRBI berada di sekitar tebakan acak. IRBI adalah indeks perencanaan penanggulangan bencana dan tidak dirancang untuk menebak lokasi rumah rusak." },
      { judul: "Bobot sederhana sama baiknya", isi: "Indeks NB-EAD hanya terbukti lebih tepat dari IRBI. Bobot setara punya rata-rata tertinggi, dan model yang lebih rumit tidak mengunggulinya." },
      { judul: "Cocok untuk mengurutkan, bukan menghitung", isi: "Urutan daerahnya lumayan, tetapi jumlah rumah rusak yang diperkirakan meleset jauh, kadang lebih dari 20 kali." },
      { judul: "Lima zona menyambung tidak cocok", isi: "Memaksa lima zona nasional yang wilayahnya menyambung membuat isi tiap zona terlalu beragam. Risiko gempa terlalu terlokalisasi." },
    ],
    catatan: (ojk: string, setara: string) => `AUC rata-rata zona OJK ${ojk}; bobot setara ${setara}.`,
    bacaJudul: "Cara membaca",
    bacaIsi:
      "Skor di peta hanya peringkat antar-daerah berdasarkan riwayat guncangan merusak 1973–2019. Skor ini tidak meramalkan gempa, tidak menghitung kerugian dalam rupiah, dan tidak dipakai untuk menetapkan tarif asuransi. Daerah yang belum pernah terguncang kuat belum tentu aman.",
    istilah: "Daftar istilah",
    batasan: "Semua keterbatasan",
  },
  en: {
    pil: "Research · public data only · preregistered · November 2026",
    judul: "Do earthquake risk indices point to the places where houses later get damaged?",
    sub: "512 Indonesian districts, tested against housing damage in four periods from 2014 to 2026.",
    intro:
      "This study builds an earthquake risk score for each district from data before each test period, then checks it against the houses that were actually damaged afterwards. The test is repeated over four periods and compared with BNPB's IRBI 2024, the OJK 2017 earthquake tariff zones, and five other ways of building an index.",
    penulis: "Izvio Prijaya Mumin · IT Division, PT Reasuransi MAIPARK Indonesia",
    bukaPeta: "Open the map",
    caraKerja: "How it works",
    angka: (a: { dibi: number; cocok: number; gempa_cocok: number }, rusak: number) => [
      { nilai: String(a.dibi), label: "Damage records", ket: "DIBI (BNPB), 2008-2026" },
      { nilai: `${Math.round((a.cocok / a.dibi) * 100)}%`, label: "Matched to an earthquake", ket: `${a.cocok} records, ${a.gempa_cocok} earthquakes` },
      { nilai: "512", label: "Districts scored", ket: "rebuilt for every period" },
      { nilai: "4", label: "Test periods", ket: `2014-2026, ${rusak} damaged district-periods` },
    ],
    cincinLabel: "mean AUC",
    cincinJudul: "How accurate the NB-EAD index is",
    cincinIsi: (sp: string) =>
      `AUC is how often the index gives a damaged district a higher score than an undamaged one. 0.5 is a coin flip and 1 is always right. This is the mean over four test periods; the rank correlation is ${sp}.`,
    lihatUji: "See the tests",
    unggulJudul: "Gain over IRBI 2024",
    unggulIsi: (lo: string, hi: string, irbi: string) => `Mean AUC difference over four periods, with a 95% confidence range of ${lo} to ${hi}. IRBI on its own scores ${irbi}, about the same as guessing.`,
    semuaHasil: "All results",
    aucJudul: "Mean AUC of eight indices",
    aucPil: "512 districts · 4 periods",
    aucCatatan: "The thin line marks 0.5 (a coin flip). The axis starts at 0.45.",
    petaJudul: "Explore 512 districts",
    petaIsi: "See the risk score for each district and compare it with the OJK zones, IRBI 2024, the zoning results, and the damage that actually happened. The map scores come from the preliminary analysis.",
    lapisan: "7 map layers",
    temuanJudul: "Main findings",
    temuan: [
      { judul: "IRBI 2024 does not point to where houses get damaged", isi: "In all four periods the AUC of IRBI sits near a coin flip. IRBI is a disaster planning index and was not built to predict where houses will be damaged." },
      { judul: "Simple weights do just as well", isi: "The NB-EAD index only beats IRBI. Equal weights has the highest mean, and the more complex model does not outperform it." },
      { judul: "Good for ranking, not for counting", isi: "The ranking of districts is reasonable, but the predicted number of damaged houses is far off, sometimes by more than 20 times." },
      { judul: "Five connected zones do not fit", isi: "Forcing five national zones that are each one connected area leaves the districts inside each zone too different. Earthquake risk is too localised." },
    ],
    catatan: (ojk: string, setara: string) => `Mean AUC of the OJK zones: ${ojk}. Equal weights: ${setara}.`,
    bacaJudul: "How to read this",
    bacaIsi:
      "The map score ranks districts by their history of damaging shaking from 1973 to 2019. It does not forecast earthquakes, does not estimate losses in rupiah, and is not meant for setting insurance rates. A district that has not been shaken hard yet is not necessarily safe.",
    istilah: "Glossary",
    batasan: "All limitations",
  },
};

export default function Beranda({ lang }: { lang: Lang }) {
  const t = T[lang];
  const n = (x: number, d = 3) => f(x, d, lang);
  const vsIrbi = h1("IRBI 2024");
  const urut = [...auc].sort((a, b) => b.rata2 - a.rata2);
  const rusak = R.lipatan.reduce((s, l) => s + l.n_rusak, 0);
  const [lo, hi] = [0.45, 0.7];

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
          <Cincin nilai={usulan.rata2} teks={n(usulan.rata2)} label={t.cincinLabel} />
          <div className="min-w-40 flex-1">
            <p className="font-semibold">{t.cincinJudul}</p>
            <p className="mt-1 text-sm text-base-content/70">{t.cincinIsi(n(usulan.spearman_rata2))}</p>
            <Link href={`${rute("hasil", lang)}#validasi`} className="pil mt-3 hover:border-primary">
              {t.lihatUji} <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          {t.angka(R.angka, rusak).map((a, i) => (
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
          <p className="mt-2 text-sm opacity-90">{t.unggulIsi(n(vsIrbi.prov[0]), n(vsIrbi.prov[1]), n(cari("IRBI 2024").rata2))}</p>
          <Link href={`${rute("hasil", lang)}#h1`} className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-base-100 px-4 text-sm font-medium text-base-content">
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
              const sorot = v.indeks === USULAN;
              const lebar = ((v.rata2 - lo) / (hi - lo)) * 100;
              return (
                <li key={v.indeks} className="grid grid-cols-[minmax(0,10rem)_1fr_3rem] items-center gap-3 text-sm">
                  <span className={sorot ? "font-semibold" : "text-base-content/75"}>{namaIndeks(v.indeks, lang)}</span>
                  <span className="relative h-3 rounded-full bg-base-200" aria-hidden>
                    <span className="absolute inset-y-0 w-px bg-[var(--viz-axis)]" style={{ left: `${((0.5 - lo) / (hi - lo)) * 100}%` }} />
                    <span className={`absolute inset-y-0 left-0 rounded-full ${sorot ? "bg-[var(--viz-2)]" : "bg-[var(--viz-1)]"}`} style={{ width: `${lebar}%` }} />
                  </span>
                  <span className="text-right tabular-nums">{n(v.rata2)}</span>
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
          <p className="mt-5 text-xs text-base-content/60">{t.catatan(n(cari("Zona tarif OJK 2017").rata2), n(cari("Bobot setara").rata2))}</p>
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
