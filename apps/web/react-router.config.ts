import type { Config } from "@react-router/dev/dist/config";
import { sentryOnBuildEnd } from "@sentry/react-router";

const config: Config = {
  ssr: true,
  buildEnd: async ({ viteConfig, reactRouterConfig, buildManifest }) => {
    await sentryOnBuildEnd({ viteConfig, reactRouterConfig, buildManifest });
  },
};

export default config;
