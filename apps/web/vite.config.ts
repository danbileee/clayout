import path from "path";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  /**
   * @property plugins
   * the order matters. cloudflare plugin should come at last.
   */
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    svgr(),
    cloudflare(),
  ],
  build: {
    outDir: "build/client",
    manifest: true,
    ssrManifest: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
