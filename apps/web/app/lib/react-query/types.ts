import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

type FetcherFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Promise<AxiosResponse<unknown, unknown>>;
type Returns<TFn extends FetcherFn> = Awaited<ReturnType<TFn>>;

export type Refetcher<Fetcher extends FetcherFn, TError = unknown> = (
  options?: RefetchOptions
) => Promise<QueryObserverResult<Returns<Fetcher> | undefined, TError>>;
