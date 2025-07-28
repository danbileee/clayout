type QueryKeyResult<Params = undefined> =
  | readonly [...string[], Params]
  | readonly string[];

export function getQueryKey<Params = undefined>(
  endpoint: string,
  params?: Params
): QueryKeyResult<Params> {
  const baseQueryKey = endpoint.split("/").filter(Boolean);

  return params
    ? ([...baseQueryKey, params] as const)
    : ([...baseQueryKey] as const);
}
