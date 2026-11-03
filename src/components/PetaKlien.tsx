"use client";

import dynamic from "next/dynamic";

// Leaflet butuh window, jadi tidak dirender di server.
const PetaLeaflet = dynamic(() => import("./PetaLeaflet"), {
  ssr: false,
  loading: () => <div className="grid h-[560px] place-items-center rounded-box border border-base-300 text-sm text-base-content/60">Memuat peta…</div>,
});

export default PetaLeaflet;
