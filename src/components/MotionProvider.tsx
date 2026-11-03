"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useEffect } from "react";

/** Motion menghormati reduced motion; Lenis memberi smooth scroll kecuali pengguna memilih reduced motion. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -96 }, lerp: 0.12 });
    return () => lenis.destroy();
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
