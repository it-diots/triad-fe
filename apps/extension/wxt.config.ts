import { defineConfig } from "wxt";
import { resolve } from "path";
import tailwindcss from "tailwindcss";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  outDir: "./dist",
  alias: {
    "@": resolve("./"),
    "@ui": resolve("../../packages/ui/src"),
    "@shared": resolve("../../packages/shared/src"),
  },
  vite: () => ({
    plugins: [],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
  }),
  manifest: {
    name: "Triad Extension",
    description: "Triad Chrome Extension with WebSocket support",
    version: "0.0.1",
    permissions: ["storage", "activeTab"],
    host_permissions: ["wss://*/*", "https://*/*"],
    icons: {
      16: "/icon.svg",
      48: "/icon.svg",
      128: "/icon.svg",
    },
    action: {
      default_popup: "/popup.html",
      default_icon: "/icon.svg",
    },
  },
});
