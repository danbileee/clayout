import { useRef } from "react";

type TimerType = "timeout" | "interval";

export function useTimer(type?: TimerType) {
  const fn = type === "timeout" ? setTimeout : setInterval;

  return useRef<ReturnType<typeof fn> | null>(null);
}
