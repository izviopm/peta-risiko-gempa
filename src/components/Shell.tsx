import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import MotionProvider from "@/components/MotionProvider";
import Nav from "@/components/Nav";
import { type Lang, rute } from "@/lib/i18n";
import { MENU, SUB_TENTANG } from "@/lib/menu";
import { SKRIP_TEMA } from "@/lib/tema";
import "../app/globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const KAKI = {
  id: {
    judul: "Peta Risiko Gempa Kabupaten/Kota",
    penulis: "Izvio Prijaya Mumin · Divisi IT, PT Reasuransi MAIPARK Indonesia. Naskah penelitian versi 1.1, November 2026.",
    sumber:
      "Sumber data: DIBI BNPB, USGS, BPS, geoBoundaries (CC BY 4.0), IRBI 2024 BNPB, dan SEOJK 6/2017. Peta ini membandingkan daerah berdasarkan riwayat kerusakan. Peta ini bukan ramalan gempa dan bukan dasar penetapan tarif.",
    nav: "Navigasi bawah",
  },
  en: {
    judul: "Earthquake Risk Map of Indonesian Districts",
    penulis: "Izvio Prijaya Mumin · IT Division, PT Reasuransi MAIPARK Indonesia. Research paper version 1.1, November 2026.",
    sumber:
      "Data: DIBI (BNPB), USGS, BPS, geoBoundaries (CC BY 4.0), IRBI 2024 (BNPB), and OJK Circular 6/2017. The map ranks districts by their damage history. It does not forecast earthquakes and is not a basis for setting insurance rates.",
    nav: "Footer navigation",
  },
};

/** Kerangka html/body bersama; dipakai root layout tiap bahasa. */
export default function Shell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const k = KAKI[lang];
  const daftar = (items: typeof MENU) =>
    items.map((m) => (
      <li key={m.k}>
        <Link href={rute(m.k, lang)} className="link-hover link">
          {m.label[lang]}
        </Link>
      </li>
    ));
  return (
    <html lang={lang} data-theme="gempa" className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      {/* Shell dipakai sebagai root layout App Router, jadi <head> di sini sah. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: SKRIP_TEMA }} />
      </head>
      <body className="flex min-h-full flex-col bg-base-200 font-sans text-base-content">
        <MotionProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="mt-12 border-t border-base-300">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm sm:px-6 md:grid-cols-3">
              <div>
                <p className="font-semibold">{k.judul}</p>
                <p className="mt-2 text-base-content/70">{k.penulis}</p>
              </div>
              <nav aria-label={k.nav} className="grid grid-cols-2 gap-x-6">
                <ul className="space-y-1.5">{daftar(MENU)}</ul>
                <ul className="space-y-1.5">{daftar(SUB_TENTANG.slice(1))}</ul>
              </nav>
              <p className="text-base-content/70">{k.sumber}</p>
            </div>
          </footer>
        </MotionProvider>
      </body>
    </html>
  );
}
