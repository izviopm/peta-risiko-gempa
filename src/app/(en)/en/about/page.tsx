import type { Metadata } from "next";
import Tentang from "@/views/Tentang";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return <Tentang lang="en" />;
}
