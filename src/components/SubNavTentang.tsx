"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { langDari, rute } from "@/lib/i18n";
import { SUB_TENTANG } from "@/lib/menu";

export default function SubNavTentang() {
  const p = usePathname();
  const lang = langDari(p);
  return (
    <nav aria-label={lang === "en" ? "About sections" : "Bagian Tentang"} className="mx-auto max-w-7xl px-3 pt-6 sm:px-5">
      <ul className="flex gap-2 overflow-x-auto pb-1">
        {SUB_TENTANG.map((m) => {
          const h = rute(m.k, lang);
          const aktif = p === h;
          return (
            <li key={m.k} className="shrink-0">
              <Link
                href={h}
                aria-current={aktif ? "page" : undefined}
                className={`relative inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  aktif ? "border-primary font-medium text-primary-content" : "border-base-300 bg-base-100 hover:border-primary/50"
                }`}
              >
                {aktif && <motion.span layoutId="sub-tentang-aktif" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} aria-hidden />}
                <span className="relative">{m.label[lang]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
