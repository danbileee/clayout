import type { FetcherWithComponents } from "react-router";

interface ActionResultResolved<Data = undefined> {
  message?: string;
  data?: Data;
  error?: unknown;
}

export type ActionResult<Data = undefined> = Promise<
  ActionResultResolved<Data> | Response
>;

export function getActionResults<Data = undefined>(
  fetcher: FetcherWithComponents<ActionResultResolved<Data>>
): { success?: string; error?: string } {
  return {
    success: !fetcher.data?.error ? fetcher.data?.message : undefined,
    error: fetcher.data?.error ? fetcher.data?.message : undefined,
  };
}
