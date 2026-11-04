import type { Metadata } from "next";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: { default: "Earthquake Risk Map of Indonesian Districts", template: "%s · Earthquake Risk Map" },
  description: "A test of earthquake risk indices for 512 Indonesian districts against houses damaged in four periods from 2014 to 2026, compared with IRBI 2024 and the OJK 2017 earthquake tariff zones.",
  alternates: { languages: { id: "/" } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Shell lang="en">{children}</Shell>;
}
