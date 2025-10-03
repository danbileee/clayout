import { getSite, getSiteQueryKey } from "@/apis/sites";
import { LoadingPlaceholder } from "@/components/shared/placeholder/loading";
import { FullScreenBox } from "@/components/ui/box";
import { useParamsId } from "@/hooks/useParamsId";
import { handleError } from "@/lib/axios/handleError";
import type { Refetcher } from "@/lib/react-query/types";
import { useClientQuery } from "@/lib/react-query/useClientQuery";
import { useHydrateEditor } from "@/lib/zustand/editor";
import { joinPath, Paths } from "@/routes";
import { useQueryClient } from "@tanstack/react-query";
import {
  SiteBlockSchema,
  SitePageSchema,
  type SiteBlock,
  type SitePageWithRelations,
  type SiteWithRelations,
  type Tables,
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

export const EditorTabs = {
  Content: "Content",
  Design: "Design",
} as const;

export type EditorTab = keyof typeof EditorTabs;

interface SiteContextState {
  menu: SiteMenu;
  selectedPageId: number | null;
  selectedBlockId: number | null;
  editorTab: EditorTab;
}

const OPEN_PAGE_EDITOR = "OPEN_PAGE_EDITOR";
const CLOSE_PAGE_EDITOR = "CLOSE_PAGE_EDITOR";
const OPEN_BLOCK_EDITOR = "OPEN_BLOCK_EDITOR";
const CLOSE_BLOCK_EDITOR = "CLOSE_BLOCK_EDITOR";
const SET_MENU = "SET_MENU";
const SET_PAGE = "SET_PAGE";
const SET_EDITOR_TAB = "SET_EDITOR_TAB";

type SiteContextAction =
  | { type: typeof OPEN_PAGE_EDITOR; pageId: number }
  | { type: typeof CLOSE_PAGE_EDITOR }
  | { type: typeof OPEN_BLOCK_EDITOR; blockId: number }
  | { type: typeof CLOSE_BLOCK_EDITOR }
  | { type: typeof SET_MENU; menu: SiteMenu }
  | { type: typeof SET_PAGE; pageId: number | null }
  | { type: typeof SET_EDITOR_TAB; tab: EditorTab };

type SiteContextReducer = (
  state: SiteContextState,
  action: SiteContextAction
) => SiteContextState;

interface SiteContextValue extends SiteContextState {
  site?: SiteWithRelations;
  primaryDomain?: Tables<"site_domains">;
  selectedPage?: SitePageWithRelations;
  selectedBlock?: SiteBlock;
  refetchSite: Refetcher<typeof getSite>;
  invalidateSiteCache: () => Promise<void>;
  openBlockEditor: (blockId: number) => void;
  closeBlockEditor: VoidFunction;
  openPageEditor: (pageId: number) => void;
  closePageEditor: VoidFunction;
  setMenu: (menu: SiteMenu) => void;
  setPage: (pageId: number) => void;
  setBlockTab: (tab: EditorTab) => void;
}

export const SiteContext = createContext<SiteContextValue | null>(null);

const reducer: SiteContextReducer = (state, action) => {
  switch (action.type) {
    case OPEN_PAGE_EDITOR:
      return {
        ...state,
        selectedPageId: action.pageId,
        editorTab: EditorTabs.Content,
        menu: SiteMenus.Page,
      };
    case CLOSE_PAGE_EDITOR:
      return {
        ...state,
        editorTab: EditorTabs.Content,
        menu: SiteMenus.Pages,
      };
    case OPEN_BLOCK_EDITOR:
      return {
        ...state,
        selectedBlockId: action.blockId,
        editorTab: EditorTabs.Content,
        menu: SiteMenus.Block,
      };
    case CLOSE_BLOCK_EDITOR:
      return {
        ...state,
        selectedBlockId: null,
        editorTab: EditorTabs.Content,
        menu: SiteMenus.Blocks,
      };
    case SET_MENU:
      return { ...state, menu: action.menu, selectedBlockId: null };
    case SET_PAGE:
      return { ...state, selectedPageId: action.pageId, selectedBlockId: null };
    case SET_EDITOR_TAB:
      return { ...state, editorTab: action.tab };
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
  const hydrateEditor = useHydrateEditor();
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
    editorTab: EditorTabs.Content,
  });

  /**
   * Manual hydration function for when we need to force update the Zustand store
   */
  const hydrateEditorStore = useCallback(() => {
    if (data?.data?.site?.pages) {
      const pages = data.data.site.pages.map((page) => {
        const parsedPage = SitePageSchema.parse(page);
        const registeredBlocks = page.blocks.map((block) => {
          const parsedBlock = SiteBlockSchema.parse(block);
          const { block: registeredBlock } = new BlockRegistry().find(
            parsedBlock
          );
          return registeredBlock;
        });

        return {
          ...parsedPage,
          blocks: registeredBlocks,
        };
      });

      hydrateEditor({ pages });
    }
  }, [data?.data?.site?.pages, hydrateEditor]);

  /**
   * @useEffect
   * Hydrate Zustand store whenever site data changes (including after cache invalidation)
   */
  useEffect(() => {
    if (data?.data?.site?.pages) {
      hydrateEditorStore();
    }
  }, [data?.data?.site?.pages, hydrateEditorStore]);

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
      primaryDomain: data?.data?.site?.domains?.find(
        (domain) => domain.isPrimary
      ),
      selectedPage: matchedPage,
      selectedBlock: matchedPage?.blocks?.find(
        (b) => b.id === state.selectedBlockId
      ),
      refetchSite,
      invalidateSiteCache: async () => {
        await queryClient.invalidateQueries({ queryKey });
      },
      ...state,
      openPageEditor: async (pageId: number) => {
        dispatch({ type: OPEN_PAGE_EDITOR, pageId });
        await refetchSite();
      },
      closePageEditor: async () => {
        dispatch({ type: CLOSE_PAGE_EDITOR });
        await refetchSite();
      },
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
      setBlockTab: async (tab: EditorTab) => {
        dispatch({ type: SET_EDITOR_TAB, tab });
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
