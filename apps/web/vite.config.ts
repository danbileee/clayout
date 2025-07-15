import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  /**
   * @property plugins
   * the order matters. cloudflare plugin should come at last.
   */
  plugins: [reactRouter(), tsconfigPaths(), svgr(), cloudflare()],
  build: {
    outDir: "dist",
  },
});
