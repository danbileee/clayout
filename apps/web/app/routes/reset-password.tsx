import { postAuthResetPassword } from "@/apis/auth/reset-password";
import { postEmailsTrackClick } from "@/apis/emails/track-click";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import type { LoaderResult } from "@/lib/react-router/loader";
import { getActionResults, type ActionResult } from "@/lib/react-router/action";

export async function loader({
  request,
}: LoaderFunctionArgs): LoaderResult<undefined, { token: string }> {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token") ?? "";
  const email_id = requestUrl.searchParams.get("email_id") ?? "";
  const button_text = requestUrl.searchParams.get("button_text") ?? "";

  try {
    await postEmailsTrackClick(
      {
        id: email_id,
        link: request.url,
        button_text,
      },
      request
    );

    return {
      query: { token },
    };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);

    return {
      query: { token },
      error,
      message: errorMessage,
    };
  }
}

export const action = async ({ request }: ActionFunctionArgs): ActionResult => {
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const token = formData.get("token") as string;

  if (!password) {
    return { error: "Password is required." };
  }

  if (!token) {
    return { error: "Token not found." };
  }

  try {
    const response = await postAuthResetPassword({ password, token });

    return {
      message: response.data.message,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    return {
      error: new Error(errorMessage),
      message: errorMessage,
    };
  }
};

export default function Page() {
  const { query } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const { refetchCsrfToken } = useAuth();
  const { success, error } = getActionResults(fetcher);
  const loading = fetcher.state === "submitting";

  /**
   * @useEffect
   * Refresh CSRF token after reseting password
   *  */
  useEffect(() => {
    if (success) {
      refetchCsrfToken().then(() => {
        navigate("/");
      });
    }
  }, [navigate, success, refetchCsrfToken]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reset Your Password</CardTitle>
              <CardDescription>
                Please enter your new password below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <fetcher.Form method="post">
                <div className="flex flex-col gap-6">
                  <input type="hidden" name="token" value={query?.token} />
                  <div className="grid gap-2">
                    <Label htmlFor="password">New password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="New password"
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Saving..." : "Save new password"}
                  </Button>
                </div>
              </fetcher.Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
