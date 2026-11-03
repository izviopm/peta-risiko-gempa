import type { Metadata } from "next";
import Alur from "@/views/Alur";

export const metadata: Metadata = { title: "Alur penelitian" };

export default function Page() {
  return <Alur lang="id" />;
}
