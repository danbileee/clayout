import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { postAuthRegister } from "@/apis/auth/register";
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
import { joinPath, Paths } from "@/routes";
import { Link, redirect } from "react-router";
import { SignupSchema } from "@clayout/interface";
import { handleError } from "@/lib/axios/handleError";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";

export default function SignUp() {
  const {
    mutateAsync: register,
    isPending,
    error,
  } = useMutation({
    mutationFn: postAuthRegister,
  });
  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignupSchema });
    },
    async onSubmit(e, { formData }) {
      e.preventDefault();

      const fn = async () => {
        const username = formData.get("username")?.toString() ?? "";
        const email = formData.get("email")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";

        await register({ username, email, password });

        redirect(joinPath([Paths.auth, Paths.verify]));
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
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign up</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <form {...getFormProps(form)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor={fields.username.id}>Username</Label>
                    <Input
                      id={fields.username.id}
                      name={fields.username.name}
                      type="text"
                      placeholder="Your Name"
                      required
                    />
                    {fields.username.errors?.length
                      ? fields.username.errors.map((error) => (
                          <p key={error} className="text-sm text-red-500">
                            {error}
                          </p>
                        ))
                      : null}
                  </div>
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
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor={fields.password.id}>Password</Label>
                    </div>
                    <Input
                      id={fields.password.id}
                      name={fields.password.name}
                      type="password"
                      required
                    />
                    {fields.password.errors?.length
                      ? fields.password.errors.map((error) => (
                          <p key={error} className="text-sm text-red-500">
                            {error}
                          </p>
                        ))
                      : null}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor={fields.confirm.id}>Repeat Password</Label>
                    </div>
                    <Input
                      id={fields.confirm.id}
                      name={fields.confirm.name}
                      type="password"
                      required
                    />
                    {fields.confirm.errors?.length
                      ? fields.confirm.errors.map((error) => (
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
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Creating an account..." : "Sign up"}
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
        </div>
      </div>
    </div>
  );
}
