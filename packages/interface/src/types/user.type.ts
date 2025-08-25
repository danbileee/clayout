import { TablesInsert } from "./supabase";

export interface LoginDto
  extends Pick<TablesInsert<"users">, "email" | "password"> {}

export interface RegisterDto
  extends Pick<TablesInsert<"users">, "username" | "email" | "password"> {}
