/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_WEB_HOST: string;
  readonly VITE_ASSETS_HOST: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly SENTRY_DSN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
