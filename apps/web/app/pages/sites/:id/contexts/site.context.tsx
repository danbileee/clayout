import { getSite, getSiteQueryKey } from "@/apis/sites";
import { useParamsId } from "@/hooks/useParamsId";
import { handleError } from "@/lib/axios/handleError";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { joinPath, Paths } from "@/routes";
import type { SiteWithRelations } from "@clayout/interface";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router";

export const SiteMenus = {
  Blocks: "Blocks",
  Pages: "Pages",
  "Saved Blocks": "Saved Blocks",
} as const;

export type SiteMenu = keyof typeof SiteMenus;

interface SiteContextValue {
  site: SiteWithRelations;
  menu: SiteMenu;
  setMenu: Dispatch<SetStateAction<SiteMenu>>;
}

export const SiteContext = createContext<SiteContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export function SiteContextProvider({ children }: Props) {
  const navigate = useNavigate();
  const id = useParamsId();
  const [menu, setMenu] = useState<SiteMenu>(SiteMenus.Blocks);
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
    // TODO: Replace with empty placeholder
    return null;
  }

  return (
    <SiteContext.Provider value={{ site: data.data.site, menu, setMenu }}>
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
