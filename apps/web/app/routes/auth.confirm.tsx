import {
  useLoaderData,
  useNavigation,
  type LoaderFunctionArgs,
  redirect,
} from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { patchAuthRegister } from "@/apis/auth/register";
import { postEmailsTrackClick } from "@/apis/emails/track-click";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token") ?? "";
  const email_id = requestUrl.searchParams.get("email_id") ?? "";
  const button_text = requestUrl.searchParams.get("button_text") ?? "";

  try {
    await patchAuthRegister({ token });
    await postEmailsTrackClick({
      id: email_id,
      link: request.url,
      button_text,
    });

    return redirect(process.env.VITE_WEB_HOST || "/");
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);

    return {
      status: "error" as const,
      message: errorMessage,
    };
  }
}

export default function AuthConfirm() {
  const { message } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              Confirming Registration...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Confirmation Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="text-red-500 text-4xl">✗</div>
            <p className="text-red-700">{message}</p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
