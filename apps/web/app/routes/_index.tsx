import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { Button } from "@/components/ui/button";
import { postAuthLogout } from "@/apis/auth/logout";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import type { LoaderResult } from "@/lib/react-router/loader";
import { getActionResults, type ActionResult } from "@/lib/react-router/action";

export const loader = async ({
  request,
}: LoaderFunctionArgs): LoaderResult<undefined, { auth_confirm: string }> => {
  const requestUrl = new URL(request.url);
  const auth_confirm = requestUrl.searchParams.get("auth_confirm") ?? "";

  return {
    query: { auth_confirm },
  };
};

export const action = async ({ request }: ActionFunctionArgs): ActionResult => {
  try {
    const response = await postAuthLogout(request);

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
  const { user, refetchCsrfToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { query } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const { success, error, state } = getActionResults(fetcher);
  const loading = state === "submitting";

  /**
   * @useEffect
   * Refresh CSRF token
   * 1. after logout
   * 2. after auth confirmed (w/ email verification)
   *  */
  useEffect(() => {
    if (success || query?.auth_confirm) {
      refetchCsrfToken().then(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("auth_confirm");
        const newSearch = newParams.toString();
        navigate(newSearch ? `/?${newSearch}` : "/");
      });
    }
  }, [navigate, success, refetchCsrfToken, searchParams, query?.auth_confirm]);

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
