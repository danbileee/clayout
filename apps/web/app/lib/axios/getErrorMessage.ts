import { isAxiosError } from "axios";

export function getErrorMessage(e: unknown) {
  if (isAxiosError(e)) return e.message;
  if (e instanceof Error) return e.message;
  return "";
}
