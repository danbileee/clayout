import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
  type QueryClientConfig,
  type QueryClientProviderProps,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isAxiosError } from "axios";
import type { ReactElement, ReactNode } from "react";

const getQueryClient = (queryClientConfig?: QueryClientConfig): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 15,
        refetchOnWindowFocus: false,
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        throwOnError: (error) =>
          isAxiosError(error) ? error.status !== 401 : true,
      },
      mutations: {
        retry: false,
      },
    },
    ...queryClientConfig,
  });

export const defaultQueryClient = getQueryClient();

type Props = Omit<QueryClientProviderProps, "client"> & {
  children: ReactNode;
};

export function QueryClientProvider({
  children,
  ...props
}: Props): ReactElement {
  return (
    <ReactQueryClientProvider {...props} client={defaultQueryClient}>
      {children}
      {import.meta.env.MODE === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </ReactQueryClientProvider>
  );
}
