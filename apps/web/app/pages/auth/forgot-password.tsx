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
import { type ActionFunctionArgs, Link, useFetcher } from "react-router";
import { postAuthForgotPassword } from "@/apis/auth/forgot-password";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { getActionResults } from "@/lib/react-router/action";
import { joinPath, Paths } from "@/routes";

export const clientAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  try {
    const response = await postAuthForgotPassword({
      params: { email },
      request,
    });

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

export default function ForgotPassword() {
  const fetcher = useFetcher<typeof clientAction>();

  const { success, error } = getActionResults(fetcher);
  const loading = fetcher.state === "submitting";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {success ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Check Your Email</CardTitle>
                <CardDescription>
                  Password reset instructions sent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  If you registered using your email and password, you will
                  receive a password reset email.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                <CardDescription>
                  Type in your email and we&apos;ll send you a link to reset
                  your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <fetcher.Form method="post">
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                      />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sending..." : "Send reset email"}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      to={joinPath([Paths.login])}
                      className="underline underline-offset-4"
                    >
                      Login
                    </Link>
                  </div>
                </fetcher.Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
