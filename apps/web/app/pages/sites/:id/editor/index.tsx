import { useAuthMeta } from "@/hooks/useAuthMeta";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { useLoaderData } from "react-router";
import { EditorSidebar } from "./sidebar";
import { EditorViewer } from "./viewer";
import { SiteContextProvider } from "../contexts/site.context";
import { useUpdateEditorAuthStatus } from "@/lib/zustand/editor";
import { useEffect } from "react";

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

  /**
   * @useEffect
   * Set editor auth status to authenticated
   */
  const setAuth = useUpdateEditorAuthStatus();
  useEffect(() => {
    setAuth("authenticated");
  }, [setAuth]);

  return (
    <SiteContextProvider key="site-context">
      <EditorSidebar />
      <EditorViewer />
    </SiteContextProvider>
  );
}
