import { getAuthUserKey } from "@/apis/auth/user";
import { defaultQueryClient } from "../../providers/QuernClientProvider";
import { postAuthTokenRefresh } from "@/apis/auth/token/refresh";
import { getErrorMessage } from "./getErrorMessage";
import { AuthMetas, type AuthMeta } from "@/providers/AuthProvider";
import type { DB } from "@clayout/interface";
import { isAxiosError } from "axios";

export async function isAuthenticated(): Promise<{
  meta?: {
    auth: AuthMeta;
    user?: DB<"users"> | null;
  };
  error?: Error;
}> {
  const queryData = defaultQueryClient.getQueryData<{
    data: { user: DB<"users"> | null };
  }>(getAuthUserKey());
  const hasUser = Boolean(queryData?.data?.user);

  if (!hasUser) {
    try {
      await postAuthTokenRefresh();

      return {
        meta: {
          auth: AuthMetas.AccessTokenRefreshed,
        },
      };
    } catch (error) {
      const message = getErrorMessage(error);

      if (isAxiosError(error) && error.response?.status === 401) {
        return {
          meta: {
            auth: AuthMetas.RefreshTokenExpired,
          },
        };
      }

      return {
        meta: undefined,
        error: error instanceof Error ? error : new Error(message),
      };
    }
  }

  return {
    meta: hasUser
      ? {
          auth: AuthMetas.UserExists,
          user: queryData?.data?.user ?? null,
        }
      : undefined,
  };
}
