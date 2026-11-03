"use client";

import { useSyncExternalStore } from "react";

/** Skrip di <head> yang memasang tema sebelum render agar tidak berkedip. */
export const SKRIP_TEMA = `(function(){try{var t=localStorage.getItem("tema");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t==="dark"?"gempa-gelap":"gempa");}catch(e){}})();`;

const baca = () => document.documentElement.getAttribute("data-theme") === "gempa-gelap";

/** true bila tema gelap aktif; ikut berubah saat atribut data-theme diganti. */
export function useGelap() {
  return useSyncExternalStore(
    (cb) => {
      const o = new MutationObserver(cb);
      o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => o.disconnect();
    },
    baca,
    () => false,
  );
}
