import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import MotionProvider from "@/components/MotionProvider";
import Nav from "@/components/Nav";
import { MENU, SUB_TENTANG } from "@/lib/menu";
import { SKRIP_TEMA } from "@/lib/tema";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Peta Risiko Gempa Kabupaten/Kota", template: "%s · Peta Risiko Gempa" },
  description:
    "Validasi prediktif out-of-time indeks risiko gempa 512 kabupaten/kota di Indonesia terhadap kerusakan rumah 2020–2026, dibandingkan dengan IRBI 2024 dan zona tarif OJK 2017.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" data-theme="gempa" className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
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
                <p className="font-semibold">Peta Risiko Gempa Kabupaten/Kota</p>
                <p className="mt-2 text-base-content/70">
                  Izvio Prijaya Mumin · Divisi IT, PT Reasuransi MAIPARK Indonesia. Naskah penelitian versi 1.1, November 2026.
                </p>
              </div>
              <nav aria-label="Navigasi bawah" className="grid grid-cols-2 gap-x-6">
                <ul className="space-y-1.5">
                  {MENU.map((m) => (
                    <li key={m.href}>
                      <Link href={m.href} className="link-hover link">
                        {m.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1.5">
                  {SUB_TENTANG.slice(1).map((m) => (
                    <li key={m.href}>
                      <Link href={m.href} className="link-hover link">
                        {m.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <p className="text-base-content/70">
                Sumber data: DIBI BNPB, USGS ComCat, BPS, geoBoundaries (CC BY 4.0), IRBI 2024 BNPB, SEOJK 6/2017. Peta ini adalah indeks
                relatif dari riwayat kerusakan, bukan prakiraan gempa dan bukan dasar penetapan tarif.
              </p>
            </div>
          </footer>
        </MotionProvider>
      </body>
    </html>
  );
}
