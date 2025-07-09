import { Database } from "./supabase";

export type SupabaseDB<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
