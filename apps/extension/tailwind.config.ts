import type { Config } from "tailwindcss";
import sharedConfig from "@triad/tailwindcss-config";

const config: Config = {
  ...sharedConfig,
  content: [
    "./entrypoints/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
