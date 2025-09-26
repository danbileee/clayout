import { getSite, getSiteQueryKey } from "@/apis/sites";
import { LoadingPlaceholder } from "@/components/shared/placeholder/loading";
import { FullScreenBox } from "@/components/ui/box";
import { useParamsId } from "@/hooks/useParamsId";
import { handleError } from "@/lib/axios/handleError";
import type { Refetcher } from "@/lib/react-query/types";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { useBlocksStore } from "@/lib/zustand/editor";
import type { BlocksStore } from "@/lib/zustand/editor";
import { joinPath, Paths } from "@/routes";
import { useQueryClient } from "@tanstack/react-query";
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
  useCallback,
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
  selectedPageId: number | null;
  selectedBlockId: number | null;
  blockTab: BlockTab;
}

const OPEN_BLOCK_EDITOR = "OPEN_BLOCK_EDITOR";
const CLOSE_BLOCK_EDITOR = "CLOSE_BLOCK_EDITOR";
const SET_MENU = "SET_MENU";
const SET_PAGE = "SET_PAGE";
const SET_BLOCK_TAB = "SET_BLOCK_TAB";

type SiteContextAction =
  | { type: typeof OPEN_BLOCK_EDITOR; blockId: number }
  | { type: typeof CLOSE_BLOCK_EDITOR }
  | { type: typeof SET_MENU; menu: SiteMenu }
  | { type: typeof SET_PAGE; pageId: number | null }
  | { type: typeof SET_BLOCK_TAB; tab: BlockTab };

type SiteContextReducer = (
  state: SiteContextState,
  action: SiteContextAction
) => SiteContextState;

interface SiteContextValue extends SiteContextState {
  site?: SiteWithRelations;
  selectedPage?: SitePageWithRelations;
  selectedBlock?: SiteBlock;
  refetchSite: Refetcher<typeof getSite>;
  invalidateSiteCache: () => Promise<void>;
  openBlockEditor: (blockId: number) => void;
  closeBlockEditor: VoidFunction;
  setMenu: (menu: SiteMenu) => void;
  setPage: (pageId: number) => void;
  setBlockTab: (tab: BlockTab) => void;
}

export const SiteContext = createContext<SiteContextValue | null>(null);

const reducer: SiteContextReducer = (state, action) => {
  switch (action.type) {
    case OPEN_BLOCK_EDITOR:
      return {
        ...state,
        selectedBlockId: action.blockId,
        blockTab: BlockTabs.Content,
        menu: SiteMenus.Block,
      };
    case CLOSE_BLOCK_EDITOR:
      return {
        ...state,
        selectedBlockId: null,
        blockTab: BlockTabs.Content,
        menu: SiteMenus.Blocks,
      };
    case SET_MENU:
      return { ...state, menu: action.menu, selectedBlockId: null };
    case SET_PAGE:
      return { ...state, selectedPageId: action.pageId, selectedBlockId: null };
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
  const queryClient = useQueryClient();
  const queryKey = getSiteQueryKey({ id });
  const hydrateBlocks = useBlocksStore((s: BlocksStore) => s.hydrate);
  const { data, refetch: refetchSite } = useClientQuery({
    queryKey,
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
    selectedPageId: firstPage?.id ?? null,
    selectedBlockId: null,
    blockTab: BlockTabs.Content,
  });

  /**
   * Manual hydration function for when we need to force update the Zustand store
   */
  const hydrateBlocksStore = useCallback(() => {
    if (data?.data?.site?.pages) {
      const pages = data.data.site.pages.map((page) => {
        const blocks = page.blocks
          .map((block) => {
            const parsedBlock = SiteBlockSchema.parse(block);
            const { block: registeredBlock } = new BlockRegistry().find(
              parsedBlock
            );
            return registeredBlock;
          })
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        return {
          id: page.id,
          blocks,
        };
      });

      hydrateBlocks({ pages });
    }
  }, [data?.data?.site?.pages, hydrateBlocks]);

  /**
   * @useEffect
   * Hydrate Zustand store whenever site data changes (including after cache invalidation)
   */
  useEffect(() => {
    if (data?.data?.site?.pages) {
      hydrateBlocksStore();
    }
  }, [data?.data?.site?.pages, hydrateBlocksStore]);

  /**
   * @useEffect
   * Update first page on the realod
   */
  useEffect(() => {
    if (!state.selectedPageId && firstPage) {
      dispatch({ type: SET_PAGE, pageId: firstPage.id });
    }
  }, [firstPage, state.selectedPageId]);

  /**
   * @useMemo
   * Create a memoized context value
   */
  const contextValue = useMemo<SiteContextValue>(() => {
    const matchedPage = data?.data?.site?.pages?.find(
      (p) => p.id === state.selectedPageId
    );
    return {
      site: data?.data?.site,
      selectedPage: matchedPage,
      selectedBlock: matchedPage?.blocks?.find(
        (b) => b.id === state.selectedBlockId
      ),
      refetchSite,
      invalidateSiteCache: async () => {
        await queryClient.invalidateQueries({ queryKey });
      },
      ...state,
      openBlockEditor: async (blockId: number) => {
        dispatch({ type: OPEN_BLOCK_EDITOR, blockId });
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
      setPage: async (pageId: number | null) => {
        dispatch({ type: SET_PAGE, pageId });
        await refetchSite();
      },
      setBlockTab: async (tab: BlockTab) => {
        dispatch({ type: SET_BLOCK_TAB, tab });
        await refetchSite();
      },
    };
  }, [data?.data?.site, refetchSite, state, queryClient, queryKey]);

  if (!data) {
    return (
      <FullScreenBox>
        <LoadingPlaceholder />
      </FullScreenBox>
    );
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
