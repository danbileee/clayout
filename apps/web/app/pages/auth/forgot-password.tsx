import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
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
import { toast } from "sonner";
import { ErrorMessage } from "@/components/ui/typography";

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

        const response = await forgotPassword({
          params: { email },
        });

        toast.success(response.data.message);
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
            <Card.Root>
              <Card.Header>
                <Card.Title className="text-2xl">Check Your Email</Card.Title>
                <Card.Description>
                  Password reset instructions sent
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <p className="text-sm text-muted-foreground">
                  If you registered using your email and password, you will
                  receive a password reset email.
                </p>
              </Card.Content>
            </Card.Root>
          ) : (
            <Card.Root>
              <Card.Header>
                <Card.Title className="text-2xl">
                  Reset Your Password
                </Card.Title>
                <Card.Description>
                  Type in your email and we&apos;ll send you a link to reset
                  your password
                </Card.Description>
              </Card.Header>
              <Card.Content>
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
                            <ErrorMessage>{error}</ErrorMessage>
                          ))
                        : null}
                    </div>
                    {error ? (
                      <ErrorMessage>{getErrorMessage(error)}</ErrorMessage>
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
              </Card.Content>
            </Card.Root>
          )}
        </div>
      </div>
    </div>
  );
}
