import * as Card from "@/components/ui/card";

export default function SignUp() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card.Root>
            <Card.Header>
              <Card.Title className="text-2xl">Verify Email</Card.Title>
              <Card.Description>
                A confirmation email has been sent to your email address. To
                complete your registration, please verify your email.
              </Card.Description>
            </Card.Header>
          </Card.Root>
        </div>
      </div>
    </div>
  );
}
