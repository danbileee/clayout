import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

export function useClientQuery<
  TData,
  TError,
  TQueryKey extends readonly unknown[]
>(
  options: UseQueryOptions<TData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  return useQuery({
    ...options,
    enabled: options.enabled !== false && typeof window !== "undefined",
  });
}
