import {
  getCoutners,
  getCoutnersKey,
  patchCounters,
  postCounters,
} from "@/apis/counters";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { isAuthenticated } from "@/lib/react-router/clientLoader";
import { joinPath, Paths } from "@/routes";
import { useMemo, useRef } from "react";
import { redirect } from "react-router";

export async function clientLoader() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return redirect(joinPath([Paths.login]));
  }
}

export default function Counter() {
  const ts = useMemo(() => Date.now().toString(), []);
  const idRef = useRef<HTMLInputElement>(null);
  const createValueRef = useRef<HTMLInputElement>(null);
  const updateValueRef = useRef<HTMLInputElement>(null);
  const { data, error, isError, refetch } = useClientQuery({
    queryKey: getCoutnersKey({ ts }),
    queryFn: () => getCoutners({ params: { ts } }),
  });
  const { mutateAsync: createCounter } = useClientMutation({
    mutationFn: postCounters,
  });
  const { mutateAsync: updateCounter } = useClientMutation({
    mutationFn: patchCounters,
  });

  return (
    <div>
      {isError && (
        <p className="text-sm text-red-500">{getErrorMessage(error)}</p>
      )}
      <div>
        <input ref={createValueRef} placeholder="value" />
        <button
          onClick={() =>
            createCounter({
              params: { value: createValueRef.current?.value ?? "" },
            })
          }
        >
          Create
        </button>
      </div>
      <div>
        <input ref={idRef} placeholder="id" />
        <input ref={updateValueRef} placeholder="value" />
        <button
          onClick={() =>
            updateCounter({
              params: {
                id: parseInt(idRef.current?.value ?? "", 10),
                value: updateValueRef.current?.value ?? "",
              },
            })
          }
        >
          Update
        </button>
      </div>
      <div>
        <h1>{JSON.stringify(data?.data)}</h1>
        <button onClick={() => refetch()}>Refresh</button>
      </div>
    </div>
  );
}
