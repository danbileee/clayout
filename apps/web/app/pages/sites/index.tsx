import { getSites, getSitesQueryKey, postSites } from "@/apis/sites";
import { Button } from "@/components/ui/button";
import { useAuthMeta } from "@/hooks/useAuthMeta";
import { handleError } from "@/lib/axios/handleError";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { joinPath, Paths } from "@/routes";
import { generateSlugTail } from "@/utils/generateSlugTail";
import {
  PaginationOptions,
  SiteCategories,
  SitePageCategories,
  SiteStatuses,
  type Tables,
} from "@clayout/interface";
import { BlockData, DefaultPageContainerStyle } from "@clayout/kit";
import { useInfiniteQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useLoaderData, useNavigate } from "react-router";

const baseQueryKey: Omit<PaginationOptions<Tables<"sites">>, "from"> = {
  take: 20,
};

export async function clientLoader() {
  const { meta, error } = await isAuthenticated();

  if (error) {
    throw error;
  }

  return {
    meta,
  };
}

export default function Sites() {
  const navigate = useNavigate();
  const { meta } = useLoaderData<typeof clientLoader>();
  useAuthMeta(meta);
  const { data } = useInfiniteQuery({
    queryKey: getSitesQueryKey(baseQueryKey),
    queryFn: async ({ pageParam }) => {
      const fn = async () =>
        await getSites({
          params: {
            ...baseQueryKey,
            from: pageParam,
          },
        });
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
    getNextPageParam: (lastGroup) =>
      lastGroup?.data?.results?.cursor?.after ?? undefined,
    initialPageParam: 0,
  });
  const { mutateAsync: createSite } = useClientMutation({
    mutationFn: postSites,
  });

  const handleCreate = async () => {
    const fn = async () =>
      await createSite({
        params: {
          name: `New site`,
          slug: `new-site-${nanoid(4).toLowerCase()}`,
          category: SiteCategories["Landing Page"],
          status: SiteStatuses.Draft,
          pages: [
            {
              slug: "home",
              name: "Home Page",
              category: SitePageCategories.Static,
              isHome: true,
              isVisible: true,
              meta: {},
              containerStyle: DefaultPageContainerStyle,
              order: 0,
              blocks: [
                {
                  ...BlockData.Image,
                  slug: `image-block-${generateSlugTail()}`,
                  order: 0,
                },
                {
                  ...BlockData.Text,
                  slug: `text-block-${generateSlugTail()}`,
                  order: 1,
                },
                {
                  ...BlockData.Button,
                  slug: `button-block-${generateSlugTail()}`,
                  order: 2,
                },
              ],
            },
          ],
        },
      });

    try {
      const response = await fn();

      navigate(
        joinPath([Paths.sites, ":id"], {
          ids: [
            {
              key: ":id",
              value: response.data.site.id,
            },
          ],
        })
      );
    } catch (e) {
      const { error } = await handleError(e, { onRetry: fn });

      if (error) {
        throw error;
      }
    }
  };

  return (
    <main>
      <Button onClick={handleCreate}>Create</Button>
      <ul>
        {data?.pages
          .flatMap((d) => d?.data.results.data ?? [])
          .map((item) =>
            item ? (
              <a
                key={item.id}
                href={joinPath([Paths.sites, ":id"], {
                  ids: [
                    {
                      key: ":id",
                      value: item.id,
                    },
                  ],
                })}
              >
                <p>{item.id}</p>
                <p>{item.name}</p>
                <p>{item.slug}</p>
              </a>
            ) : null
          )}
      </ul>
    </main>
  );
}
