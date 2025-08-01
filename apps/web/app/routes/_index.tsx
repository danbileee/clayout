import { useFetcher, type ActionFunctionArgs } from "react-router";
import { Button } from "@/components/ui/button";
import { postAuthLogout } from "@/apis/auth/logout";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { getActionResults } from "@/lib/react-router/action";

export const clientAction = async ({ request }: ActionFunctionArgs) => {
  try {
    const response = await postAuthLogout({ request });

    return {
      message: response.data.message,
    };
  } catch (error) {
    const message = getErrorMessage(error);

    return {
      error,
      message,
    };
  }
};

export default function Home() {
  const { user, refetchCsrfToken, refetchUser } = useAuth();
  const fetcher = useFetcher<typeof clientAction>();

  const { error, success } = getActionResults(fetcher);
  const loading = fetcher.state === "submitting";

  /**
   * @useEffect
   * Refresh CSRF token
   *  */
  useEffect(() => {
    (async () => {
      await refetchCsrfToken();
      await refetchUser();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  return (
    <div className="flex items-center justify-center h-screen gap-2">
      <h1 className="text-3xl font-bold underline">
        Hello {user ? user.email : "World"}!
      </h1>
      {user ? (
        <fetcher.Form method="post">
          <Button type="submit" disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </fetcher.Form>
      ) : (
        <a href="/login">
          <Button>Login</Button>
        </a>
      )}
    </div>
  );
}
