import type { FetcherWithComponents } from "react-router";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ActionResultResolved<Data extends Record<string, any> = {}> {
  message?: string;
  data?: Data;
  error?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getActionResults<Data extends Record<string, any> = {}>(
  fetcher: FetcherWithComponents<ActionResultResolved<Data>>
): { success?: string; error?: string } {
  return {
    success: !fetcher.data?.error ? fetcher.data?.message : undefined,
    error: fetcher.data?.error ? fetcher.data?.message : undefined,
  };
}
