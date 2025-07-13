import type { Database } from "./supabase";

export type SupabaseTable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
