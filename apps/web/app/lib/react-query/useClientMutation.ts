import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";

export function useClientMutation<TData, TError, TVariables>(
  options: UseMutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> {
  return useMutation({
    ...options,
    // For mutations, we don't need the enabled condition since they're triggered by user actions
    // But we can add other global defaults here if needed
  });
}
