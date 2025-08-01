import type { Database } from "./supabase";

export type DB<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
