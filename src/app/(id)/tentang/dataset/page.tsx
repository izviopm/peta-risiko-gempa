import type { Metadata } from "next";
import Dataset from "@/views/Dataset";

export const metadata: Metadata = { title: "Dataset" };

export default function Page() {
  return <Dataset lang="id" />;
}
