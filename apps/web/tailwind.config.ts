import config from "@triad/tailwindcss-config";
import type { Config } from "tailwindcss";

const webConfig: Config = {
  ...config,
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default webConfig;
