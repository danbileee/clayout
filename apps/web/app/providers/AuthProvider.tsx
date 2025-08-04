import { getAuthTokenCsrf, getAuthTokenCsrfKey } from "@/apis/auth/token/csrf";
import { getAuthUser, getAuthUserKey } from "@/apis/auth/user";
import { extractClientSideTokens } from "@/lib/cookie/extractTokens";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import type { Tables } from "@clayout/interface";
import { createContext, useContext, useMemo, type ReactNode } from "react";

export const AuthMetas = {
  AccessTokenRefreshed: "AccessTokenRefreshed",
  RefreshTokenExpired: "RefreshTokenExpired",
  UserExists: "UserExists",
} as const;

export type AuthMeta = keyof typeof AuthMetas;

interface AuthContextValue {
  tokens: ReturnType<typeof extractClientSideTokens>;
  user: Tables<"users"> | null;
  refetchCsrfToken: () => Promise<{ csrfToken: string } | undefined>;
  refetchUser: () => Promise<{ user: Tables<"users"> | null } | undefined>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const { csrfToken } = extractClientSideTokens();
  const { data: tokenData, refetch: refetchCsrfToken } = useClientQuery({
    queryKey: getAuthTokenCsrfKey({ csrfToken }),
    queryFn: () => getAuthTokenCsrf(),
    enabled: !csrfToken,
  });
  const { data: userData, refetch: refetchUser } = useClientQuery({
    queryKey: getAuthUserKey(),
    queryFn: () => getAuthUser(),
    staleTime: Infinity,
  });

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      tokens: tokenData?.data ?? {},
      user: userData?.data?.user ?? null,
      refetchCsrfToken: async () => {
        const response = await refetchCsrfToken();
        return response?.data?.data;
      },
      refetchUser: async () => {
        const response = await refetchUser();
        return response?.data?.data;
      },
    }),
    [refetchCsrfToken, refetchUser, tokenData?.data, userData?.data?.user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      `useAuthContext should be called within AuthContext.Provider`
    );
  }

  return context;
}
