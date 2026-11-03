import type { Metadata } from "next";
import Dataset from "@/views/Dataset";

export const metadata: Metadata = { title: "Data" };

export default function Page() {
  return <Dataset lang="en" />;
}
