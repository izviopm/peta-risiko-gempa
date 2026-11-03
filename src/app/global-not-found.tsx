import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = { title: "404 · Peta Risiko Gempa" };

export default function GlobalNotFound() {
  return (
    <html lang="id" data-theme="gempa">
      <body className={`${jakarta.className} grid min-h-dvh place-items-center bg-base-200 p-6 text-base-content`}>
        <main className="kartu max-w-md p-8 text-center">
          <p className="text-5xl font-semibold text-primary">404</p>
          <h1 className="mt-3 text-xl font-semibold">Halaman tidak ditemukan</h1>
          <p className="mt-1 text-sm text-base-content/70">Page not found</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/" className="btn btn-primary rounded-full">Beranda</Link>
            <Link href="/en" className="btn rounded-full border-base-300 bg-base-100">Home (English)</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
