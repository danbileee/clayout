import { useAuthMeta } from "@/hooks/useAuthMeta";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { useLoaderData } from "react-router";
import { EditorSidebar } from "./sidebar";
import { EditorViewer } from "./viewer";

export async function clientLoader() {
  const { meta, error } = await isAuthenticated();

  if (error) {
    throw error;
  }

  return {
    meta,
  };
}

export default function Editor() {
  const { meta } = useLoaderData<typeof clientLoader>();
  useAuthMeta(meta);

  return (
    <>
      <EditorSidebar />
      <EditorViewer />
    </>
  );
}
