"use client";

import { Moon, Sun } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { useGelap } from "@/lib/tema";

export default function TemaToggle({ lang }: { lang: Lang }) {
  const gelap = useGelap();

  function ganti() {
    const baru = gelap ? "gempa" : "gempa-gelap";
    document.documentElement.setAttribute("data-theme", baru);
    try {
      localStorage.setItem("tema", gelap ? "light" : "dark");
    } catch {
      /* localStorage bisa diblokir */
    }
  }

  return (
    <button
      type="button"
      className="btn btn-ghost btn-circle"
      onClick={ganti}
      aria-label={lang === "en" ? (gelap ? "Switch to light theme" : "Switch to dark theme") : gelap ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      title={lang === "en" ? (gelap ? "Light theme" : "Dark theme") : gelap ? "Tema terang" : "Tema gelap"}
    >
      {gelap ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  );
}
