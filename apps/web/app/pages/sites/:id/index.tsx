import { getSite, getSiteQueryKey } from "@/apis/sites";
import { Button } from "@/components/ui/button";
import { useAuthMeta } from "@/hooks/useAuthMeta";
import { handleError } from "@/lib/axios/handleError";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { joinPath, Paths } from "@/routes";
import {
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router";

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

export default function Site() {
  const navigate = useNavigate();
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

  const handleEdit = () => {
    navigate(
      joinPath([Paths.sites, ":id", Paths.editor], {
        ids: [
          {
            key: ":id",
            value: id,
          },
        ],
      })
    );
  };

  return (
    <main>
      <Button onClick={handleEdit}>Go to edit</Button>
    </main>
  );
}
