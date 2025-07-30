import { isAxiosError } from "axios";

export function getErrorMessage(e: unknown): string {
  if (isAxiosError(e)) {
    // If it's an Axios error with response data, use the server's error message
    if (e.response?.data?.message) {
      // If message is an array, join it
      if (Array.isArray(e.response.data.message)) {
        return e.response.data.message.join(", ");
      } else {
        return e.response.data.message;
      }
    }
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return "Unknown error";
}
