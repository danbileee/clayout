import type { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { AuthMetas, useAuthContext } from "@/providers/AuthProvider";
import { joinPath, Paths } from "@/routes";
import { useEffect } from "react";
import { useNavigate } from "react-router";

/**
 * @useEffect
 * Execute the matched function for each auth meta
 */
export function useAuthMeta(
  meta?: Awaited<ReturnType<typeof isAuthenticated>>["meta"]
) {
  const navigate = useNavigate();
  const { refetchUser } = useAuthContext();

  useEffect(() => {
    // Refetch user when the token is refreshed
    if (meta?.auth === AuthMetas.AccessTokenRefreshed) {
      refetchUser();
    }

    // Navigate to the login page when the refresh token is expired
    if (meta?.auth === AuthMetas.RefreshTokenExpired) {
      navigate(joinPath([Paths.login]));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
