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
  type LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router";
import { useMutation } from "@tanstack/react-query";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ResetPasswordSchema } from "@clayout/interface";
import { handleError } from "@/lib/axios/handleError";
import { toast } from "sonner";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token") ?? "";
  const email_id = requestUrl.searchParams.get("email_id") ?? "";
  const button_text = requestUrl.searchParams.get("button_text") ?? "";

  try {
    await postEmailsTrackClick({
      params: {
        id: email_id,
        button_text: button_text,
        link: request.url,
      },
      request,
    });

    return {
      query: {
        token,
      },
    };
  } catch (error) {
    const message = getErrorMessage(error);

    return {
      error: new Error(message),
      message,
      query: {
        token,
      },
    };
  }
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const { query } = useLoaderData<typeof loader>();
  const {
    mutateAsync: resetPassword,
    isPending,
    error,
  } = useMutation({
    mutationFn: postAuthResetPassword,
  });
  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ResetPasswordSchema });
    },
    async onSubmit(e, { formData }) {
      e.preventDefault();

      const fn = async () => {
        const password = formData.get("password")?.toString() ?? "";
        const token = formData.get("token")?.toString() ?? "";

        if (!token) {
          throw new Error(`Token not found`);
        }

        const response = await resetPassword({
          params: { password, token },
        });

        toast.success(response.data.message);

        // Add a little delay for smooth UX
        setTimeout(() => {
          navigate("/");
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
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reset Your Password</CardTitle>
              <CardDescription>
                Please enter your new password below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form {...getFormProps(form)}>
                <div className="flex flex-col gap-6">
                  <input type="hidden" name="token" value={query?.token} />
                  <div className="grid gap-2">
                    <Label htmlFor={fields.password.id}>New password</Label>
                    <Input
                      id={fields.password.id}
                      name={fields.password.name}
                      type="password"
                      placeholder="New password"
                      required
                    />
                    {fields.password.errors?.length
                      ? fields.password.errors.map((error) => (
                          <p key={error} className="text-sm text-red-500">
                            {error}
                          </p>
                        ))
                      : null}
                    {error ? (
                      <p className="text-sm text-red-500">
                        {getErrorMessage(error)}
                      </p>
                    ) : null}
                  </div>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Saving..." : "Save new password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
