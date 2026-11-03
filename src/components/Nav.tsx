"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU } from "@/lib/menu";


export default function Nav() {
  const p = usePathname();
  const aktif = (h: string) => (h === "/" ? p === "/" : p.startsWith(h));
  return (
    <header className="navbar sticky top-0 z-[1000] border-b border-base-300 bg-base-100/90 px-4 backdrop-blur">
      <div className="flex-1">
        <Link href="/" className="text-base font-semibold tracking-tight">
          Peta Risiko Gempa
          <span className="ml-2 hidden text-sm font-normal text-base-content/60 sm:inline">kabupaten/kota Indonesia</span>
        </Link>
      </div>
      <nav className="hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          {MENU.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className={aktif(m.href) ? "menu-active" : ""} aria-current={aktif(m.href) ? "page" : undefined}>
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="dropdown dropdown-end lg:hidden">
        <button tabIndex={0} className="btn btn-ghost btn-sm" aria-label="Buka menu">
          Menu
        </button>
        <ul tabIndex={0} className="menu dropdown-content z-[1001] mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow">
          {MENU.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className={aktif(m.href) ? "menu-active" : ""}>
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
