import type { Metadata } from "next";
import Keterbatasan from "@/views/Keterbatasan";

export const metadata: Metadata = { title: "Limitations" };

export default function Page() {
  return <Keterbatasan lang="en" />;
}
