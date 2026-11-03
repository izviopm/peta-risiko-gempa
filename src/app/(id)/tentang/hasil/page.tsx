import type { Metadata } from "next";
import Hasil from "@/views/Hasil";

export const metadata: Metadata = { title: "Hasil" };

export default function Page() {
  return <Hasil lang="id" />;
}
