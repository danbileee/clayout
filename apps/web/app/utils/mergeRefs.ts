import type { Ref, RefCallback, RefObject } from "react";

export function mergeRefs<T = unknown>(
  ...refs: Array<RefObject<T> | Ref<T>>
): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
