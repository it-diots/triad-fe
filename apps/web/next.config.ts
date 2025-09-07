import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@triad/ui", "@triad/shared"],
};

export default nextConfig;
