import path from "path";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import {
  sentryReactRouter,
  type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "wev",
  project: "clayout-web",
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

// https://vite.dev/config/
export default defineConfig((config) => {
  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
      sentryReactRouter(sentryConfig, config),
      tsconfigPaths(),
      svgr(),
    ],
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
