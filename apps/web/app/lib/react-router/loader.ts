interface LoaderResultResolved<Data = undefined, Query = undefined> {
  message?: string;
  data?: Data;
  error?: unknown;
  query?: Query;
}

export type LoaderResult<Data = undefined, Query = undefined> = Promise<
  LoaderResultResolved<Data, Query> | Response
>;
