"use client";

import dynamic from "next/dynamic";
import type { Lang } from "@/lib/i18n";

// Leaflet butuh window, jadi tidak dirender di server.
const PetaLeaflet = dynamic(() => import("./PetaLeaflet"), {
  ssr: false,
  loading: () => <div className="kartu grid h-[560px] place-items-center text-sm text-base-content/60">…</div>,
});

export default function PetaKlien({ lang }: { lang: Lang }) {
  return <PetaLeaflet lang={lang} />;
}
