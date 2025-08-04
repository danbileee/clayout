import { useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";
import { postAuthLogout } from "@/apis/auth/logout";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { useEffect } from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import { joinPath, Paths } from "@/routes";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { useMutation } from "@tanstack/react-query";

export async function clientLoader() {
  const { meta } = await isAuthenticated();

  return {
    meta,
  };
}

export default function Home() {
  const { user, refetchCsrfToken, refetchUser } = useAuthContext();
  const { meta } = useLoaderData<typeof clientLoader>();
  const {
    mutateAsync: logout,
    error,
    isSuccess,
    isError,
    isPending,
  } = useMutation({
    mutationFn: postAuthLogout,
  });
  const finalUser = meta?.user ?? user;

  /**
   * @useEffect
   * Refresh CSRF token and remove user after logging out
   *  */
  useEffect(() => {
    (async () => {
      if (isSuccess) {
        await refetchCsrfToken();
        await refetchUser();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <div className="flex items-center justify-center h-screen gap-2">
      <h1 className="text-3xl font-bold underline">
        Hello {finalUser ? finalUser.email : "World"}!
      </h1>
      {finalUser ? (
        <div>
          <Button onClick={() => logout({})} disabled={isPending}>
            {isPending ? "Logging out..." : "Logout"}
          </Button>
          {isError && (
            <p className="text-sm text-red-500">{getErrorMessage(error)}</p>
          )}
        </div>
      ) : (
        <a href={joinPath([Paths.login])}>
          <Button>Login</Button>
        </a>
      )}
    </div>
  );
}
