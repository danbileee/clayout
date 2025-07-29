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
): FetcherWithComponents<{}> & { success?: string; error?: string } {
  return {
    ...fetcher,
    success: !fetcher.data?.error ? fetcher.data?.message : undefined,
    error: fetcher.data?.error ? fetcher.data?.message : undefined,
  };
}

export function getActionFormError(
  fieldname: string,
  message?: string
): ActionResultResolved {
  return {
    error: new Error(`FORM ERROR: ${fieldname}`),
    message: message ?? "This field value has an unknown error",
  };
}
