import path from "path";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => {
  return {
    /**
     * @property plugins
     * the order matters. cloudflare plugin should come at last.
     */
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), svgr()],
    build: {
      outDir: "build",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./app"),
      },
    },
    ssr: {
      noExternal: ["react-router-dom"], // Ensure it gets bundled
    },
  };
});
