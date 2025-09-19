import * as Card from "@/components/ui/card";
import { useSearchParams } from "react-router";

export default function Page() {
  const [searchParams] = useSearchParams();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card.Root>
            <Card.Header>
              <Card.Title className="text-2xl">
                Sorry, something went wrong.
              </Card.Title>
            </Card.Header>
            <Card.Content>
              {searchParams?.get("error") ? (
                <p className="text-sm text-muted-foreground">
                  Code error: {searchParams?.get("error")}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  An unspecified error occurred.
                </p>
              )}
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    </div>
  );
}
