import type { Metadata } from "next";
import Peta from "@/views/Peta";

export const metadata: Metadata = { title: "Map" };

export default function Page() {
  return <Peta lang="en" />;
}
