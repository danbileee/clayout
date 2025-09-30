import type { z } from "zod";

type Params<T> = z.SafeParseReturnType<T, T>;

/**
 * Get the error message for a single zod property
 * @param validation parsed result from the schema validation
 * @returns error message (would be undefined if no error detected)
 */
export function getError<T>(validation: Params<T>): string | undefined {
  return validation.error?.issues?.[0]?.message;
}
