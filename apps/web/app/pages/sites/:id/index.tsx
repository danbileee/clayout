import { getSite, getSiteQueryKey } from "@/apis/sites";
import { Button } from "@/components/ui/button";
import { useAuthMeta } from "@/hooks/useAuthMeta";
import { useParamsId } from "@/hooks/useParamsId";
import { handleError } from "@/lib/axios/handleError";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { joinPath, Paths } from "@/routes";
import { useLoaderData, useNavigate } from "react-router";

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
