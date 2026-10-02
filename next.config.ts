import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the finished invitation is plain files you can host anywhere
  // (Vercel, Netlify, GitHub Pages) and share as a single link.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
