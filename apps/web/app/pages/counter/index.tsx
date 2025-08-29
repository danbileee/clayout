import { getCoutners, getCoutnersKey } from "@/apis/counters";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { useMemo } from "react";
import { useLoaderData } from "react-router";
import { CountersForm } from "./form";
import { useAuthMeta } from "@/hooks/useAuthMeta";

export async function clientLoader() {
  const { meta, error } = await isAuthenticated();

  if (error) {
    throw error;
  }

  return {
    meta,
  };
}

export default function Counter() {
  const { meta } = useLoaderData<typeof clientLoader>();
  useAuthMeta(meta);
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
