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
  const { data } = useInfiniteQuery({
    queryKey: getSitesQueryKey(),
    queryFn: async ({ pageParam }) => {
      const fn = async () =>
        await getSites({
          params: {
            from: pageParam,
            take: 20,
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
              slug: `new-page-${now}`,
              name: "New Page",
              category: SitePageCategories.Static,
              isHome: true,
              isVisible: true,
              order: 0,
              blocks: [
                {
                  type: SiteBlockTypes.Image,
                  name: "Image Block",
                  slug: `image-block-${now}`,
                  data: {
                    url: "https://i.ytimg.com/vi/fK9CNdJK9lo/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA2y_V7p3K3rc1MT0byoni-LpQoVA",
                    link: "https://youtu.be/CGC0BhQwnik?si=XGgxXwxqDl2dsJAy",
                    alt: "Blackberry Creme Brulee",
                  },
                  style: {
                    width: "100%",
                  },
                  containerStyle: {
                    padding: "20px 20px 20px 20px",
                    backgroundColor: "black",
                  },
                },
                {
                  type: SiteBlockTypes.Text,
                  name: "Text Block",
                  slug: `text-block-${now}`,
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
                    margin: "2px 0px 2px 0px",
                  },
                  containerStyle: {
                    padding: "40px 40px 40px 40px",
                    backgroundColor: "black",
                  },
                },
                {
                  type: SiteBlockTypes.Button,
                  name: "Button Block",
                  slug: `button-block-${now}`,
                  data: {
                    link: "https://www.youtube.com/@lifeisworship.studio",
                    text: "View Channel",
                  },
                  style: {
                    backgroundColor: "white",
                    padding: "8px 10px 8px 10px",
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
                  containerStyle: {
                    padding: "20px 20px 20px 20px",
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
