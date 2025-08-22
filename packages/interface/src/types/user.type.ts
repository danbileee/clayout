import { Tables } from "./supabase";

export interface LoginDto extends Pick<Tables<"users">, "email" | "password"> {}

export interface RegisterDto
  extends Pick<Tables<"users">, "username" | "email" | "password"> {}
