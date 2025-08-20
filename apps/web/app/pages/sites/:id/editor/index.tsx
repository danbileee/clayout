import { useAuthMeta } from "@/hooks/useAuthMeta";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { EditorSidebar } from "./sidebar";
import { EditorViewer } from "./viewer";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { getSite, getSiteQueryKey } from "@/apis/sites";
import { handleError } from "@/lib/axios/handleError";

export async function loader({ params }: LoaderFunctionArgs) {
  return {
    id: params.id ? parseInt(params.id, 10) : undefined,
  };
}

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
  const { id = 0 } = useLoaderData<typeof loader>();
  const { meta } = useLoaderData<typeof clientLoader>();
  useAuthMeta(meta);
  const { data } = useClientQuery({
    queryKey: getSiteQueryKey({ id }),
    queryFn: async (ctx) => {
      const fn = async () => await getSite({ params: { id } });

      try {
        return await fn();
      } catch (e) {
        const { error, data } = await handleError(e, { onRetry: fn });

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
