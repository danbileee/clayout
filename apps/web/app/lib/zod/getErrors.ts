import type { z } from "zod";

type Params<T> = z.SafeParseReturnType<T, T>;

type Returns<T> = Partial<Record<keyof T, string>>;

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
