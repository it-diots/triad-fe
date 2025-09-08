import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@triad/ui", "@triad/shared"],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
