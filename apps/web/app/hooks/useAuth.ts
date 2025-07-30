import { getAuthTokenCsrf, getAuthTokenCsrfKey } from "@/apis/auth/token/csrf";
import { getAuthUser, getAuthUserKey } from "@/apis/auth/user";
import { extractClientSideTokens } from "@/lib/cookie/extractTokens";
import type { DB } from "@clayout/interface";
import { useClientQuery } from "@/lib/react-query/useClientQuery";

interface Returns {
  tokens: ReturnType<typeof extractClientSideTokens>;
  user: DB<"users"> | null;
  refetchCsrfToken: () => Promise<{ csrfToken: string } | undefined>;
  refetchUser: () => Promise<{ user: DB<"users"> | null } | undefined>;
}

export function useAuth(): Returns {
  const { csrfToken } = extractClientSideTokens();
  const { data: tokenData, refetch: refetchCsrfToken } = useClientQuery({
    queryKey: getAuthTokenCsrfKey({ csrfToken }),
    queryFn: (ctx) => getAuthTokenCsrf(),
    enabled: !csrfToken,
  });
  const { data: userData, refetch: refetchUser } = useClientQuery({
    queryKey: getAuthUserKey(),
    queryFn: (ctx) => getAuthUser(),
  });

  return {
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
  };
}
