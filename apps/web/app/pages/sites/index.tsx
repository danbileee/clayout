import { getSites, getSitesQueryKey, postSites } from "@/apis/sites";
import { Button } from "@/components/ui/button";
import { useAuthMeta } from "@/hooks/useAuthMeta";
import { handleError } from "@/lib/axios/handleError";
import { isAuthenticated } from "@/lib/axios/isAuthenticated";
import { useClientMutation } from "@/lib/react-query/useClientMutation";
import { joinPath, Paths } from "@/routes";
import {
  SiteBlockTypes,
  SiteCategories,
  SitePageCategories,
  SiteStatuses,
} from "@clayout/interface";
import { useInfiniteQuery } from "@tanstack/react-query";
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

export default function Sites() {
  const navigate = useNavigate();
  const { meta } = useLoaderData<typeof clientLoader>();
  useAuthMeta(meta);
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: getSitesQueryKey(),
    queryFn: async (ctx) => {
      const fn = async () =>
        await getSites({
          params: {
            pagination: {
              from: ctx.pageParam,
              take: 20,
            },
          },
        });

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
    getNextPageParam: (lastGroup) => lastGroup?.data.results.cursor.after,
    initialPageParam: 0,
  });
  const { mutateAsync: createSite } = useClientMutation({
    mutationFn: postSites,
  });

  const handleCreate = async () => {
    const now = Date.now();
    const fn = async () =>
      await createSite({
        params: {
          name: `New site ${now}`,
          slug: `new-site-${now}`,
          category: SiteCategories["Landing Page"],
          status: SiteStatuses.Draft,
          pages: [
            {
              slug: "new-page-1",
              name: "New Page",
              category: SitePageCategories.Static,
              blocks: [
                {
                  type: SiteBlockTypes.Image,
                  name: "Image Block",
                  slug: "image-block-1",
                  data: {
                    url: "https://i.ytimg.com/vi/CGC0BhQwnik/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBFiTNkOCpCcIk5R_Yek8JIqyud8A",
                    link: "https://youtu.be/CGC0BhQwnik?si=XGgxXwxqDl2dsJAy",
                    alt: "자기 십자가를 지고",
                  },
                  style: {
                    width: "100%",
                  },
                  container_style: {
                    padding: "20px",
                    backgroundColor: "black",
                  },
                },
                {
                  type: SiteBlockTypes.Text,
                  name: "Text Block",
                  slug: "text-block-1",
                  data: {
                    value:
                      "Everyone has the right to freedom of thought, conscience and religion; this right includes freedom to change his religion or belief, and freedom, either alone or in community with others and in public or private, to manifest his religion or belief in teaching, practice, worship and observance. Everyone has the right to freedom of opinion and expression; this right includes freedom to hold opinions without interference and to seek, receive and impart information and ideas through any media and regardless of frontiers. Everyone has the right to rest and leisure, including reasonable limitation of working hours and periodic holidays with pay.",
                  },
                  style: {
                    color: "white",
                    fontFamily: `"Edu NSW ACT Cursive", cursive`,
                    fontSize: "18px",
                    lineHeight: "1.41",
                    fontWeight: "normal",
                    margin: "2px 0px",
                  },
                  container_style: {
                    padding: "40px",
                    backgroundColor: "black",
                  },
                },
                {
                  type: SiteBlockTypes.Button,
                  name: "Button Block",
                  slug: "button-block-1",
                  data: {
                    link: "https://www.youtube.com/@lifeisworship.studio",
                    text: "View Channel",
                  },
                  style: {
                    backgroundColor: "white",
                    padding: "8px 10px",
                    color: "black",
                    fontFamily: `"Libertinus Sans", sans-serif`,
                    fontSize: "24px",
                    fontWeight: "bold",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "red",
                    borderRadius: "8px",
                    textDecoration: "underline",
                    textAlign: "right",
                  },
                  container_style: {
                    padding: "20px",
                    backgroundColor: "black",
                  },
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
          .flatMap((d) => d?.data.results.data)
          .map((item) =>
            item ? (
              <a
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
