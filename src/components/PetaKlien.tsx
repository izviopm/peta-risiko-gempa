"use client";

import dynamic from "next/dynamic";

// Leaflet butuh window, jadi tidak dirender di server.
const PetaLeaflet = dynamic(() => import("./PetaLeaflet"), {
  ssr: false,
  loading: () => <div className="kartu grid h-[560px] place-items-center text-sm text-base-content/60">Memuat peta…</div>,
});

export default PetaLeaflet;
