import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Halaman lama dipindah ke bawah /tentang (3 Nov 2026). "/data" persis saja, agar /data/*.json tetap jalan.
  async redirects() {
    return [
      { source: "/alur", destination: "/tentang/alur", permanent: true },
      { source: "/data", destination: "/tentang/dataset", permanent: true },
      { source: "/hasil", destination: "/tentang/hasil", permanent: true },
      { source: "/keterbatasan", destination: "/tentang/keterbatasan", permanent: true },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
