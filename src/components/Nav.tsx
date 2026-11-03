"use client";

import { Activity, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MENU } from "@/lib/menu";
import TemaToggle from "./TemaToggle";

export default function Nav() {
  const p = usePathname();
  const [buka, setBuka] = useState(false);
  const aktif = (h: string) => (h === "/" ? p === "/" : p.startsWith(h));
  const tautan = (cls: string) =>
    MENU.map((m) => (
      <li key={m.href}>
        <Link
          href={m.href}
          aria-current={aktif(m.href) ? "page" : undefined}
          className={`relative rounded-full ${cls} ${aktif(m.href) ? "font-medium text-primary-content hover:bg-transparent" : ""}`}
          onClick={() => setBuka(false)}
        >
          {aktif(m.href) && (
            <motion.span layoutId={`nav-aktif-${cls || "hp"}`} className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} aria-hidden />
          )}
          <span className="relative">{m.label}</span>
        </Link>
      </li>
    ));

  return (
    <header className="sticky top-0 z-[1000] px-3 pt-3 sm:px-5">
      <nav className="kartu navbar mx-auto min-h-0 max-w-7xl !rounded-full bg-base-100/90 px-2 py-1.5 backdrop-blur sm:px-3" aria-label="Navigasi utama">
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-2.5 rounded-full pr-2 font-semibold focus-visible:outline-2 focus-visible:outline-primary">
            <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-content">
              <Activity className="size-5" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-sm">Peta Risiko Gempa</span>
              <span className="block text-xs font-normal text-base-content/60">kabupaten/kota Indonesia</span>
            </span>
          </Link>
        </div>
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal gap-1 p-0">{tautan("px-5")}</ul>
        </div>
        <div className="navbar-end gap-1">
          <TemaToggle />
          <button
            type="button"
            className="btn btn-ghost btn-circle md:hidden"
            aria-expanded={buka}
            aria-controls="menu-hp"
            aria-label={buka ? "Tutup menu" : "Buka menu"}
            onClick={() => setBuka((v) => !v)}
          >
            {buka ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {buka && (
          <motion.div
            id="menu-hp"
            className="kartu mx-auto mt-2 max-w-7xl md:hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="menu menu-lg w-full p-2">{tautan("")}</ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
