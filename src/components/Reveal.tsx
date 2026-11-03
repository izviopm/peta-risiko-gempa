"use client";

import { motion, useReducedMotion } from "motion/react";

/** Muncul pelan saat discroll; dimatikan bila pengguna memilih reduced motion. */
export default function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const diam = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={diam ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
