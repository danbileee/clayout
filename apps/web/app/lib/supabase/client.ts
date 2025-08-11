import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    import.meta.env.SUPABASE_URL!,
    import.meta.env.SUPABASE_ANON_KEY!
  );
}
