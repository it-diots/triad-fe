import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@triad/ui",
    "@triad/shared",
    "@triad/tailwindcss-config",
    "@triad/eslint-config",
    "@triad/typescript-config",
  ],
};

export default nextConfig;
