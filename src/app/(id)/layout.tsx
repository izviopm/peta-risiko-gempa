import type { Metadata } from "next";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: { default: "Peta Risiko Gempa Kabupaten/Kota", template: "%s · Peta Risiko Gempa" },
  description: "Uji indeks risiko gempa 512 kabupaten/kota di Indonesia terhadap rumah yang rusak pada 2020–2026, dibandingkan dengan IRBI 2024 dan zona tarif gempa OJK 2017.",
  alternates: { languages: { en: "/en" } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Shell lang="id">{children}</Shell>;
}
