import { postAuthResendEmail } from "@/apis/auth/resend-email";
import * as Card from "@/components/ui/card";
import { handleError } from "@/lib/axios/handleError";
import { useClientMutation } from "@/lib/react-query/useClientMutation";

export default function Verify() {
  const { mutateAsync: resendEmail } = useClientMutation({
    mutationFn: postAuthResendEmail,
  });

  const handleResendEmail = async () => {
    const fn = async () => {
      await resendEmail({
        params: {
          key: "verify",
        },
      });
    };

    try {
      await fn();
    } catch (e) {
      const { error } = await handleError(e, {
        onRetry: fn,
      });

      if (error) {
        throw error;
      }
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card.Root>
            <Card.Header>
              <Card.Title className="text-2xl">Verify Email</Card.Title>
              <Card.Description className="mb-2">
                We just sent a confirmation email to your inbox. Please verify
                your email to finish signing up. If it doesn't arrive within 5
                minutes, check your spam folder or resend it.
              </Card.Description>
              <button
                className="underline underline-offset-4 text-left"
                onClick={handleResendEmail}
              >
                Resend email
              </button>
            </Card.Header>
          </Card.Root>
        </div>
      </div>
    </div>
  );
}
