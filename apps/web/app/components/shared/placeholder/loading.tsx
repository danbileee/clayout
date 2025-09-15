import { SpinnerIcon } from "@/icons/spinner";

export function Loading() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <SpinnerIcon />
      </div>
    </main>
  );
}
