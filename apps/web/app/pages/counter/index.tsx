import { getCoutners, getCoutnersKey } from "@/apis/counters";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { AuthMetas, useAuthContext } from "@/providers/AuthProvider";
import { joinPath, Paths } from "@/routes";
import { useEffect, useMemo } from "react";
import { redirect, useLoaderData } from "react-router";
import { CountersForm } from "./CountersForm";

export async function clientLoader() {
  const { meta, error } = await isAuthenticated();

  if (meta?.auth === AuthMetas.RefreshTokenExpired) {
    return redirect(joinPath([Paths.login]));
  }

  if (error) {
    throw error;
  }

  return {
    meta,
  };
}

export default function Counter() {
  const { meta } = useLoaderData<typeof clientLoader>();
  const { refetchUser } = useAuthContext();
  const ts = useMemo(() => Date.now().toString(), []);
  const {
    data,
    error,
    isError,
    refetch: refetchCounters,
  } = useClientQuery({
    queryKey: getCoutnersKey({ ts }),
    queryFn: () => getCoutners({ params: { ts } }),
  });

  /**
   * @useEffect
   * Refetch user when the token is refreshed
   */
  useEffect(() => {
    if (meta?.auth === AuthMetas.AccessTokenRefreshed) {
      refetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {isError && (
        <p className="text-sm text-red-500">{getErrorMessage(error)}</p>
      )}
      <CountersForm />
      <div>
        <h1>{JSON.stringify(data?.data)}</h1>
        <button onClick={() => refetchCounters()}>Refresh</button>
      </div>
    </div>
  );
}
