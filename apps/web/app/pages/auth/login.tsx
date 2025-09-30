import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { postAuthLogin } from "@/apis/auth/login";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/providers/AuthProvider";
import { joinPath, Paths } from "@/routes";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { LoginSchema } from "@clayout/interface";
import { handleError } from "@/lib/axios/handleError";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { ErrorMessage } from "@/components/ui/typography";
import { useTimer } from "@/hooks/useTimer";

export default function Login() {
  const timer = useTimer();
  const { refetchUser, refetchCsrfToken } = useAuthContext();
  const {
    mutateAsync: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: postAuthLogin,
  });
  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema });
    },
    async onSubmit(e, { formData }) {
      e.preventDefault();

      const fn = async () => {
        const email = formData.get("email")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";
        await login({
          params: { email, password },
        });
        await refetchUser();
        await refetchCsrfToken();

        // Redirect after a short delay to ensure cookies are set
        if (timer.current) {
          clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
          if (window.history.length === 1) {
            window.location.href = `/`;
          } else {
            window.history.back();
          }
        }, 1000);
      };

      try {
        await fn();
      } catch (e) {
        const { error } = await handleError(e, { onRetry: fn });

        if (error) {
          throw error;
        }
      }
    },
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card.Root>
            <Card.Header>
              <Card.Title className="text-2xl">Login</Card.Title>
              <Card.Description>
                Enter your email below to login to your account
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <form {...getFormProps(form)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor={fields.email.id}>Email</Label>
                    <TextInput
                      id={fields.email.id}
                      name={fields.email.name}
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                    {fields.email.errors?.length
                      ? fields.email.errors.map((error) => (
                          <ErrorMessage key={error}>{error}</ErrorMessage>
                        ))
                      : null}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor={fields.password.id}>Password</Label>
                      <Link
                        to={joinPath([Paths["forgot-password"]])}
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <TextInput
                      id={fields.password.id}
                      type={fields.password.name}
                      name="password"
                      required
                    />
                    {fields.password.errors?.length
                      ? fields.password.errors.map((error) => (
                          <ErrorMessage key={error}>{error}</ErrorMessage>
                        ))
                      : null}
                  </div>
                  {error ? (
                    <p className="text-sm text-red-500">
                      {getErrorMessage(error)}
                    </p>
                  ) : null}
                  <Button type="submit" isFluid disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    to={joinPath([Paths.signup])}
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    </div>
  );
}
