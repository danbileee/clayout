import { createClient } from "@/lib/supabase/server";
import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { type User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<{ user: User | null }> => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return { user: null };
  }

  const { supabase } = createClient(request);
  const { data, error } = await supabase.auth.getUser();

  console.log({ error, data });

  if (error || !data?.user) {
    redirect("/login");
    return { user: null };
  }

  return data;
};

export default function Home() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex items-center justify-center h-screen gap-2">
      <h1 className="text-3xl font-bold underline">
        Hello {user ? user.email : "World"}!
      </h1>
      {user ? (
        <a href="/logout">
          <Button>Logout</Button>
        </a>
      ) : (
        <a href="/login">
          <Button>Login</Button>
        </a>
      )}
    </div>
  );
}
