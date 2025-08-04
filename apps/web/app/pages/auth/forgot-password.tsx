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
import { Link } from "react-router";
import { postAuthForgotPassword } from "@/apis/auth/forgot-password";
import { joinPath, Paths } from "@/routes";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ForgotPasswordSchema } from "@clayout/interface";
import { handleError } from "@/lib/axios/handleError";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";

export default function ForgotPassword() {
  const {
    mutateAsync: forgotPassword,
    isPending,
    error,
  } = useMutation({
    mutationFn: postAuthForgotPassword,
  });
  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ForgotPasswordSchema });
    },
    async onSubmit(e, { formData }) {
      e.preventDefault();

      const fn = async () => {
        const email = formData.get("email")?.toString() ?? "";

        return await forgotPassword({
          params: { email },
        });
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
          {form.status === "success" ? (
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
                <form {...getFormProps(form)}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor={fields.email.id}>Email</Label>
                      <Input
                        id={fields.email.id}
                        name={fields.email.name}
                        type="email"
                        placeholder="m@example.com"
                        required
                      />
                      {fields.email.errors?.length
                        ? fields.email.errors.map((error) => (
                            <p key={error} className="text-sm text-red-500">
                              {error}
                            </p>
                          ))
                        : null}
                    </div>
                    {error ? (
                      <p className="text-sm text-red-500">
                        {getErrorMessage(error)}
                      </p>
                    ) : null}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? "Sending..." : "Send reset email"}
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
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
