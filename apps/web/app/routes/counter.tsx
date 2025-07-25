import type { DB } from "@clayout/interface";
import { useEffect, useRef, useState } from "react";

export default function Counter() {
  const idRef = useRef<HTMLInputElement>(null);
  const createValueRef = useRef<HTMLInputElement>(null);
  const updateValueRef = useRef<HTMLInputElement>(null);
  const [counters, setCounters] = useState<DB<"counters">[]>([]);

  async function createCounter() {
    await fetch(`${import.meta.env.VITE_API_HOST}/counters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        value: createValueRef.current?.value ?? "",
      }),
    });
  }

  async function updateCounter() {
    await fetch(
      `${import.meta.env.VITE_API_HOST}/counters/${idRef.current?.value}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: updateValueRef.current?.value ?? "",
        }),
      }
    );
  }

  async function getCounters() {
    const response = await fetch(
      `${import.meta.env.VITE_API_HOST}/counters/${Date.now()}`,
      { method: "GET" }
    );
    const parsed = await response.json();

    setCounters(parsed);
  }

  useEffect(() => {
    getCounters();
  }, []);

  return (
    <div>
      <div>
        <input ref={createValueRef} placeholder="value" />
        <button onClick={createCounter}>Create</button>
      </div>
      <div>
        <input ref={idRef} placeholder="id" />
        <input ref={updateValueRef} placeholder="value" />
        <button onClick={updateCounter}>Update</button>
      </div>
      <div>
        <h1>{JSON.stringify(counters)}</h1>
        <button onClick={getCounters}>Refresh</button>
      </div>
    </div>
  );
}
