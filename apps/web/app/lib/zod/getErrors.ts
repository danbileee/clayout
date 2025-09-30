import type { z } from "zod";

type Params<T> = z.SafeParseReturnType<T, T>;

type Returns<T> = Partial<Record<keyof T, string>>;

/**
 * Get the error message for a zod object with multiple properties
 * @param validation parsed result from the schema validation
 * @returns record of error messages
 */
export function getErrors<T extends Record<string, unknown>>(
  validation: Params<T>
): Returns<T> {
  return (
    validation.error?.issues?.reduce((acc, issue) => {
      return {
        ...acc,
        [issue.path[0]]: issue.message,
      };
    }, {}) ?? {}
  );
}
