export const EnvKeys = {
  DATABASE_URL: 'DATABASE_URL',
  SUPABASE_URL: 'SUPABASE_URL',
  SUPABASE_SERVICE_ROLE_KEY: 'SUPABASE_SERVICE_ROLE_KEY',
} as const;

export type EnvKey = keyof typeof EnvKeys;
