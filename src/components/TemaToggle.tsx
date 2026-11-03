"use client";

import { Moon, Sun } from "lucide-react";
import { useGelap } from "@/lib/tema";

export default function TemaToggle() {
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
      aria-label={gelap ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      title={gelap ? "Tema terang" : "Tema gelap"}
    >
      {gelap ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  );
}
