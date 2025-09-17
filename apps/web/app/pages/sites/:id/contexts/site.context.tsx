import { getSite, getSiteQueryKey } from "@/apis/sites";
import { LoadingPlaceholder } from "@/components/shared/placeholder/loading";
import { useParamsId } from "@/hooks/useParamsId";
import { handleError } from "@/lib/axios/handleError";
import type { Refetcher } from "@/lib/react-query/types";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { useHydrateBlocksStore } from "@/lib/zustand/editor";
import { joinPath, Paths } from "@/routes";
import {
  SiteBlockSchema,
  type SiteBlock,
  type SitePageWithRelations,
  type SiteWithRelations,
} from "@clayout/interface";
import { BlockRegistry } from "@clayout/kit";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";

export const SiteMenus = {
  Pages: "Pages",
  Page: "Page",
  Blocks: "Blocks",
  Block: "Block",
  "Saved Blocks": "Saved Blocks",
  "Saved Block": "Saved Block",
} as const;

export type SiteMenu = keyof typeof SiteMenus;

export const BlockTabs = {
  Content: "Content",
  Design: "Design",
} as const;

export type BlockTab = keyof typeof BlockTabs;

interface SiteContextState {
  menu: SiteMenu;
  page: SitePageWithRelations | null;
  block: SiteBlock | null;
  blockTab: BlockTab;
}

const OPEN_BLOCK_EDITOR = "OPEN_BLOCK_EDITOR";
const CLOSE_BLOCK_EDITOR = "CLOSE_BLOCK_EDITOR";
const SET_MENU = "SET_MENU";
const SET_PAGE = "SET_PAGE";
const SET_BLOCK_TAB = "SET_BLOCK_TAB";

type SiteContextAction =
  | { type: typeof OPEN_BLOCK_EDITOR; block: SiteBlock }
  | { type: typeof CLOSE_BLOCK_EDITOR }
  | { type: typeof SET_MENU; menu: SiteMenu }
  | { type: typeof SET_PAGE; page: SitePageWithRelations | null }
  | { type: typeof SET_BLOCK_TAB; tab: BlockTab };

type SiteContextReducer = (
  state: SiteContextState,
  action: SiteContextAction
) => SiteContextState;

interface SiteContextValue extends SiteContextState {
  site?: SiteWithRelations;
  refetchSite: Refetcher<typeof getSite>;
  openBlockEditor: (block: SiteBlock) => void;
  closeBlockEditor: VoidFunction;
  setMenu: (menu: SiteMenu) => void;
  setPage: (page: SitePageWithRelations | null) => void;
  setBlockTab: (tab: BlockTab) => void;
}

export const SiteContext = createContext<SiteContextValue | null>(null);

const reducer: SiteContextReducer = (state, action) => {
  switch (action.type) {
    case OPEN_BLOCK_EDITOR:
      return {
        ...state,
        block: action.block,
        blockTab: BlockTabs.Content,
        menu: SiteMenus.Block,
      };
    case CLOSE_BLOCK_EDITOR:
      return {
        ...state,
        block: null,
        blockTab: BlockTabs.Content,
        menu: SiteMenus.Blocks,
      };
    case SET_MENU:
      return { ...state, menu: action.menu, block: null };
    case SET_PAGE:
      return { ...state, page: action.page, block: null };
    case SET_BLOCK_TAB:
      return { ...state, blockTab: action.tab };
    default:
      return state;
  }
};

interface Props {
  children: ReactNode;
}

export function SiteContextProvider({ children }: Props) {
  const navigate = useNavigate();
  const id = useParamsId();
  const { data, refetch: refetchSite } = useClientQuery({
    queryKey: getSiteQueryKey({ id }),
    queryFn: async () => {
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
  const [state, dispatch] = useReducer(reducer, {
    menu: SiteMenus.Pages,
    page: firstPage,
    block: null,
    blockTab: BlockTabs.Content,
  });

  /**
   * @useMemo
   * Memoize hydration data to prevent infinite loops
   */
  const hydrationData = useMemo(
    () => ({
      pages:
        data?.data?.site?.pages?.map((page) => {
          const blocks = page.blocks.map((block) => {
            const parsedBlock = SiteBlockSchema.parse(block);
            const { block: registeredBlock } = new BlockRegistry().find(
              parsedBlock
            );
            return registeredBlock;
          });

          return {
            id: page.id,
            blocks,
          };
        }) ?? [],
    }),
    [data?.data?.site?.pages]
  );

  /**
   * @useEffect
   * Hydrate blocks store data
   */
  useHydrateBlocksStore(hydrationData);

  /**
   * @useEffect
   * Update first page on the realod
   */
  useEffect(() => {
    if (!state.page && firstPage) {
      dispatch({ type: SET_PAGE, page: firstPage });
    }
  }, [firstPage, state.page]);

  /**
   * @useMemo
   * Create a memoized context value
   */
  const contextValue = useMemo<SiteContextValue>(
    () => ({
      site: data?.data?.site,
      refetchSite,
      ...state,
      openBlockEditor: async (block: SiteBlock) => {
        dispatch({ type: OPEN_BLOCK_EDITOR, block });
        await refetchSite();
      },
      closeBlockEditor: async () => {
        dispatch({ type: CLOSE_BLOCK_EDITOR });
        await refetchSite();
      },
      setMenu: async (menu: SiteMenu) => {
        dispatch({ type: SET_MENU, menu });
        await refetchSite();
      },
      setPage: async (page: SitePageWithRelations | null) => {
        dispatch({ type: SET_PAGE, page });
        await refetchSite();
      },
      setBlockTab: async (tab: BlockTab) => {
        dispatch({ type: SET_BLOCK_TAB, tab });
        await refetchSite();
      },
    }),
    [data?.data?.site, refetchSite, state]
  );

  if (!data) {
    return <LoadingPlaceholder />;
  }

  return (
    <SiteContext.Provider value={contextValue}>{children}</SiteContext.Provider>
  );
}

export function useSiteContext(): SiteContextValue {
  const context = useContext(SiteContext);

  if (!context) {
    /**
     * During HMR, sometimes the context gets lost temporarily
     */
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "useSiteContext called outside of provider - this might be due to HMR"
      );
    }

    throw new Error(
      `useSiteContext should be called within SiteContext.Provider`
    );
  }

  return context;
}
