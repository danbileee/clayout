import path from "path";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => {
  const entryPath = "app/entries/";
  const serverEntryPath = path.join(entryPath, "entry.server.tsx");
  const clientEntryPath = path.join(entryPath, "entry.client.tsx");

  return {
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
      target: "esnext",
      outDir: isSsrBuild ? "build/server" : "build/client",
      ssr: isSsrBuild ? serverEntryPath : false,
      rollupOptions: {
        input: isSsrBuild ? serverEntryPath : clientEntryPath,
      },
      emptyOutDir: false, // Prevent wiping build/client or build/server between builds
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
