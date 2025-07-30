import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
  type QueryClientConfig,
  type QueryClientProviderProps,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactElement, ReactNode } from "react";

const getQueryClient = (queryClientConfig?: QueryClientConfig): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15000,
        refetchOnWindowFocus: false,
        retry: false,
        throwOnError: false,
      },
      mutations: {
        retry: false,
      },
    },
    ...queryClientConfig,
  });

type Props = Omit<QueryClientProviderProps, "client"> & {
  queryClientConfig?: QueryClientConfig;
  children: ReactNode;
};

export function QueryClientProvider({
  queryClientConfig,
  children,
  ...props
}: Props): ReactElement {
  return (
    <ReactQueryClientProvider
      {...props}
      client={getQueryClient(queryClientConfig)}
    >
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
