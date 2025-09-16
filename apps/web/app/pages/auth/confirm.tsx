import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import * as Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { patchAuthRegister } from "@/apis/auth/register";
import { postEmailsTrackClick } from "@/apis/emails/track-click";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token") ?? "";
  const emailId = requestUrl.searchParams.get("emailId") ?? "";
  const buttonText = requestUrl.searchParams.get("buttonText") ?? "";

  return {
    data: {
      token,
      emailId,
      buttonText,
    },
  };
}

export default function AuthConfirm() {
  const { data } = useLoaderData<typeof loader>();
  const {
    mutateAsync: confirmRegister,
    error,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: patchAuthRegister,
  });
  const { mutateAsync: trackClickEmail } = useMutation({
    mutationFn: postEmailsTrackClick,
  });

  const confirmRegistration = useCallback(async () => {
    if (!data) return;

    await confirmRegister({
      params: { token: data.token },
    });
    await trackClickEmail({
      params: {
        id: data.emailId,
        link: window.location.href,
        buttonText: data.buttonText,
      },
    });

    // Add a little delay for smooth UX
    setTimeout(() => {
      window.location.href = `/`;
    }, 1000);
  }, [confirmRegister, data, trackClickEmail]);

  /**
   * @useEffect
   * Auth confirmation
   * - make the API call client-side to ensure cookies are set in the browser
   */
  useEffect(() => {
    confirmRegistration();
  }, [confirmRegistration]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <Card.Root className="w-full max-w-md">
          <Card.Header className="text-center">
            <Card.Title className="text-xl">Registration Confirmed!</Card.Title>
          </Card.Header>
          <Card.Content className="text-center">
            <div className="space-y-4">
              <div className="text-green-500 text-4xl">✓</div>
              <p className="text-green-700">
                Your email has been verified successfully. Redirecting...
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <Card.Root className="w-full max-w-md">
          <Card.Header className="text-center">
            <Card.Title className="text-xl">Confirmation Failed</Card.Title>
          </Card.Header>
          <Card.Content className="text-center">
            <div className="space-y-4">
              <div className="text-red-500 text-4xl">✗</div>
              <p className="text-red-700">
                {error ? getErrorMessage(error) : "Unknown error"}
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card.Root className="w-full max-w-md">
        <Card.Header className="text-center">
          <Card.Title className="text-xl">
            Confirming Registration...
          </Card.Title>
        </Card.Header>
        <Card.Content className="text-center">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  );
}
