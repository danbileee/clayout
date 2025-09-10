import { getSite, getSiteQueryKey } from "@/apis/sites";
import { Loading } from "@/components/placeholder/loading";
import { useParamsId } from "@/hooks/useParamsId";
import { handleError } from "@/lib/axios/handleError";
import type { Refetcher } from "@/lib/react-query/types";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { joinPath, Paths } from "@/routes";
import type {
  SiteBlock,
  SitePageWithRelations,
  SiteWithRelations,
} from "@clayout/interface";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router";

export const SiteMenus = {
  Pages: "Pages",
  Blocks: "Blocks",
  "Saved Blocks": "Saved Blocks",
} as const;

export type SiteMenu = keyof typeof SiteMenus;

interface SiteContextValue {
  site: SiteWithRelations;
  refetchSite: Refetcher<typeof getSite>;
  menu: SiteMenu;
  setMenu: Dispatch<SetStateAction<SiteMenu>>;
  page: SitePageWithRelations | null;
  setPage: Dispatch<SetStateAction<SitePageWithRelations | null>>;
  block: SiteBlock | null;
  setBlock: Dispatch<SetStateAction<SiteBlock | null>>;
}

export const SiteContext = createContext<SiteContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export function SiteContextProvider({ children }: Props) {
  const navigate = useNavigate();
  const id = useParamsId();
  const { data, refetch: refetchSite } = useClientQuery({
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
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  const firstPage = useMemo(() => data?.data?.site?.pages?.[0] ?? null, [data]);
  const [menu, setMenu] = useState<SiteMenu>(SiteMenus.Pages);
  const [page, setPage] = useState<SitePageWithRelations | null>(firstPage);
  const [block, setBlock] = useState<SiteBlock | null>(null);

  /**
   * @useEffect
   * Update first page on the realod
   */
  useEffect(() => {
    if (!page && firstPage) {
      setPage(firstPage);
    }
  }, [firstPage, page]);

  if (!data) {
    return <Loading />;
  }

  return (
    <SiteContext.Provider
      value={{
        site: data.data.site,
        refetchSite,
        menu,
        setMenu,
        page,
        setPage,
        block,
        setBlock,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteContext(): SiteContextValue {
  const context = useContext(SiteContext);

  if (!context) {
    throw new Error(
      `useSiteContext should be called within SiteContext.Provider`
    );
  }

  return context;
}
