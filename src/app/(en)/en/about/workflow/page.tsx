import type { Metadata } from "next";
import Alur from "@/views/Alur";

export const metadata: Metadata = { title: "How it works" };

export default function Page() {
  return <Alur lang="en" />;
}
