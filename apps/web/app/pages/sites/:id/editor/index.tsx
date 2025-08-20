import { useAuthMeta } from "@/hooks/useAuthMeta";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { useLoaderData, useNavigate } from "react-router";
import { EditorSidebar } from "./sidebar";
import { EditorViewer } from "./viewer";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { getSite, getSiteQueryKey } from "@/apis/sites";
import { handleError } from "@/lib/axios/handleError";
import { joinPath, Paths } from "@/routes";
import { useParamsId } from "@/hooks/useParamsId";

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
  const navigate = useNavigate();
  const id = useParamsId();
  const { meta } = useLoaderData<typeof clientLoader>();
  useAuthMeta(meta);
  const { data } = useClientQuery({
    queryKey: getSiteQueryKey({ id }),
    queryFn: async (ctx) => {
      const fn = async () => await getSite({ params: { id } });
      const redirect = async () => navigate(joinPath([Paths.login]));

      try {
        return await fn();
      } catch (e) {
        const { error, data } = await handleError(e, {
          onRetry: fn,
          onRedirect: redirect,
        });

        if (error) {
          throw error;
        }

        return data;
      }
    },
    enabled: Boolean(id),
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <EditorSidebar />
      <EditorViewer site={data.data.site} />
    </>
  );
}
