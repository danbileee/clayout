import { patchCounters, postCounters } from "@/apis/counters";
import { useRef } from "react";
import { handleError } from "@/lib/axios/handleError";
import { useClientMutation } from "@/lib/react-query/useClientMutation";

export function CountersForm() {
  const idRef = useRef<HTMLInputElement>(null);
  const createValueRef = useRef<HTMLInputElement>(null);
  const updateValueRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: createCounter } = useClientMutation({
    mutationFn: postCounters,
  });
  const { mutateAsync: updateCounter } = useClientMutation({
    mutationFn: patchCounters,
  });

  const create = async () => {
    const fn = async () =>
      await createCounter({
        params: { value: createValueRef.current?.value ?? "" },
      });

    try {
      await fn();
    } catch (e) {
      const { error } = await handleError(e, { onRetry: fn });

      if (error) {
        throw error;
      }
    }
  };

  const update = async () => {
    const fn = async () =>
      await updateCounter({
        params: {
          id: parseInt(idRef.current?.value ?? "", 10),
          value: updateValueRef.current?.value ?? "",
        },
      });

    try {
      await fn();
    } catch (e) {
      const { error } = await handleError(e, { onRetry: fn });

      if (error) {
        throw error;
      }
    }
  };

  return (
    <div>
      <div>
        <input ref={createValueRef} placeholder="value" />
        <button onClick={create}>Create</button>
      </div>
      <div>
        <input ref={idRef} placeholder="id" />
        <input ref={updateValueRef} placeholder="value" />
        <button onClick={update}>Update</button>
      </div>
    </div>
  );
}
