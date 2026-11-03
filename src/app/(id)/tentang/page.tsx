import type { Metadata } from "next";
import Tentang from "@/views/Tentang";

export const metadata: Metadata = { title: "Tentang" };

export default function Page() {
  return <Tentang lang="id" />;
}
