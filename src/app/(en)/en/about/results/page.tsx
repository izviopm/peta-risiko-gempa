import type { Metadata } from "next";
import Hasil from "@/views/Hasil";

export const metadata: Metadata = { title: "Results" };

export default function Page() {
  return <Hasil lang="en" />;
}
