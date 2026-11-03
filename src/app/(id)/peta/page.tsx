import type { Metadata } from "next";
import Peta from "@/views/Peta";

export const metadata: Metadata = { title: "Peta" };

export default function Page() {
  return <Peta lang="id" />;
}
