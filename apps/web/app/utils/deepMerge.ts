/**
 * Deep merges two objects, with the second object taking precedence
 * Only merges plain objects, arrays are replaced entirely
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      // If both values are plain objects (not arrays, dates, etc.), merge them
      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        !((sourceValue as unknown) instanceof Date) &&
        targetValue &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue) &&
        !((targetValue as unknown) instanceof Date)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        // Otherwise, replace the value
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}
