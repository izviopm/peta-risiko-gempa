import type { Metadata } from "next";
import Keterbatasan from "@/views/Keterbatasan";

export const metadata: Metadata = { title: "Keterbatasan" };

export default function Page() {
  return <Keterbatasan lang="id" />;
}
