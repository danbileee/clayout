import { useCallback } from "react";
import { createStore } from "zustand";
import { useStore } from "zustand/react";
import { BlockSchemaByType } from "@clayout/interface";
import type { BlockSchema, BlockOf, PageSchema } from "@clayout/interface";
import type { DependencyList } from "react";
import { deepMerge } from "@/utils/deepMerge";
import {
  type HistoryManager,
  type CommandResult,
  createHistoryManager,
  createUpdateBlockCommand,
  createRemoveBlockCommand,
  createReorderBlockCommand,
  createReorderBlocksCommand,
  createAddBlockCommand,
  createUpdatePageCommand,
  createReorderPageCommand,
  createReorderPagesCommand,
} from "./commands";

const EMPTY_STRING_ARRAY: string[] = [];

// ----------------------------------------------------------------------------
// Editor Store
// ----------------------------------------------------------------------------

type EditorState = {
  blockById: Record<string, BlockSchema>;
  blockIdsByPageId: Record<string, string[]>;
  pageSchemaByPageId: Record<string, PageSchema>;
  pageIds: number[];
};

type EditorActions = {
  // Block management actions
  upsertBlocks: (pageId: number, blocks: BlockSchema[]) => void;
  upsertBlock: (pageId: number, block: BlockSchema) => void;
  updateBlock: {
    <K extends keyof typeof BlockSchemaByType>(
      blockId: number,
      type: K,
      updates: Partial<BlockOf<K>>
    ): void;
    <K extends keyof typeof BlockSchemaByType>(
      blockId: number,
      type: K,
      updater: (prev: BlockOf<K>) => Partial<BlockOf<K>>
    ): void;
  };
  addBlock: (pageId: number, block: BlockSchema) => void;
  removeBlock: (pageId: number, blockId: number) => void;
  reorderBlock: (pageId: number, blockId: number, targetId: number) => void;
  reorderBlocks: (pageId: number, blockIds: string[]) => void;
  hydrate: (data: { pages: PageSchema[] }) => void;

  // Page management actions
  addPage: (page: PageSchema) => void;
  removePage: (pageId: number) => void;
  updatePage: (pageId: number, page: Partial<PageSchema>) => void;
  reorderPage: (sourcePageId: number, targetPageId: number) => void;
  reorderPages: (pageIds: number[]) => void;
  upsertPages: (pages: PageSchema[]) => void;

  // History management actions
  history: HistoryManager;
  undo: (pageId: number) => CommandResult | null;
  redo: (pageId: number) => CommandResult | null;
  canUndo: (pageId: number) => boolean;
  canRedo: (pageId: number) => boolean;
  getHistoryState: (pageId: number) => {
    totalCommands: number;
    currentIndex: number;
    canUndo: boolean;
    canRedo: boolean;
    recentCommands: Array<{
      id: string;
      type: string;
      description: string;
      timestamp: number;
    }>;
  };
  clearHistory: () => void;
  clearPageHistory: (pageId: number) => void;
};

export type EditorStore = EditorState & EditorActions;

const toKey = (id: number) => String(id);

const createEditorStore = () => {
  const historyManager = createHistoryManager();

  return createStore<EditorStore>()((set, get) => ({
    /**
     * =======================================================================
     * State
     * =======================================================================
     */

    blockById: {},
    blockIdsByPageId: {},
    pageSchemaByPageId: {},
    pageIds: [],

    hydrate: (data) => {
      const newById: EditorState["blockById"] = {};
      const newIdsByPageId: EditorState["blockIdsByPageId"] = {};
      const newPageSchemaByPageId: EditorState["pageSchemaByPageId"] = {};
      const newPageIds: EditorState["pageIds"] = [];

      for (const page of data.pages) {
        if (!page.id) continue;

        const pageKey = toKey(page.id);
        const blockIds: string[] = [];

        for (const block of page.blocks || []) {
          if (!block.id) continue;

          const blockKey = toKey(block.id);
          newById[blockKey] = block;
          blockIds.push(blockKey);
        }

        newPageSchemaByPageId[pageKey] = page;
        newIdsByPageId[pageKey] = blockIds;
        newPageIds.push(page.id);
      }

      newPageIds.sort((a, b) => sortPagesByOrder(a, b, newPageSchemaByPageId));

      set(() => ({
        blockById: newById,
        blockIdsByPageId: newIdsByPageId,
        pageSchemaByPageId: newPageSchemaByPageId,
        pageIds: newPageIds,
      }));
    },

    /**
     * =======================================================================
     * Block Actions
     * =======================================================================
     */

    upsertBlocks: (pageId, blocks) =>
      set((state) => {
        const pageKey = toKey(pageId);
        const newById = { ...state.blockById };
        const blockIds: string[] = [];

        for (const block of blocks) {
          const key = toKey(block.id!);
          newById[key] = block;
          blockIds.push(key);
        }

        return {
          blockById: newById,
          blockIdsByPageId: { ...state.blockIdsByPageId, [pageKey]: blockIds },
        };
      }),

    upsertBlock: (pageId, block) =>
      set((state) => {
        const pageKey = toKey(pageId);
        const blockKey = toKey(block.id!);
        const existing = state.blockIdsByPageId[pageKey] ?? [];
        const hasId = existing.includes(blockKey);
        return {
          blockById: { ...state.blockById, [blockKey]: block },
          blockIdsByPageId: {
            ...state.blockIdsByPageId,
            [pageKey]: hasId ? existing : [...existing, blockKey],
          },
        };
      }),

    updateBlock: (
      blockId: number,
      _type: keyof typeof BlockSchemaByType,
      updated:
        | Partial<BlockSchema>
        | ((prev: BlockSchema) => Partial<BlockSchema>)
    ) => {
      const state = get();
      const blockKey = toKey(blockId);
      const oldBlock = state.blockById[blockKey];

      if (!oldBlock) return;

      // Calculate new block data
      const partial =
        typeof updated === "function" ? updated(oldBlock) : updated;

      if (!partial || partial === oldBlock) return;

      const newBlock = deepMerge(oldBlock, partial);

      if (newBlock === oldBlock) return;

      // Find the page ID for this block
      const pageId = Object.entries(state.blockIdsByPageId).find(
        ([, blockIds]) => blockIds.includes(blockKey)
      )?.[0];

      if (!pageId) return;

      const updateFn = createUpdateBlockFunction(set);

      const command = createUpdateBlockCommand(
        blockId,
        parseInt(pageId),
        oldBlock,
        newBlock,
        updateFn
      );

      historyManager.execute(command, parseInt(pageId));
    },

    addBlock: (pageId, block) => {
      if (!block) return;

      const state = get();
      const pageKey = toKey(pageId);
      const blockIds = state.blockIdsByPageId[pageKey] ?? [];
      const addFn = createAddBlockFunction(set);
      const removeFn = createRemoveBlockFunction(set);

      const command = createAddBlockCommand(
        pageId,
        block,
        blockIds.length,
        addFn,
        removeFn
      );

      historyManager.execute(command, pageId);
    },

    removeBlock: (pageId, blockId) => {
      const state = get();
      const pageKey = toKey(pageId);
      const blockKey = toKey(blockId);
      const block = state.blockById[blockKey];
      const blockIds = state.blockIdsByPageId[pageKey] ?? [];
      const blockIndex = blockIds.indexOf(blockKey);

      if (!block || blockIndex === -1) return;

      const removeFn = createRemoveBlockFunction(set);
      const addFn = createAddBlockFunction(set);

      const command = createRemoveBlockCommand(
        pageId,
        blockId,
        block,
        blockIndex,
        removeFn,
        addFn
      );

      historyManager.execute(command, pageId);
    },

    reorderBlock: (pageId, blockId, targetId) => {
      const state = get();
      const pageKey = toKey(pageId);
      const blockKey = toKey(blockId);
      const targetKey = toKey(targetId);
      const blockIds = state.blockIdsByPageId[pageKey] ?? [];
      const oldIndex = blockIds.indexOf(blockKey);
      const newIndex = blockIds.indexOf(targetKey);

      if (oldIndex === -1 || newIndex === -1) return;

      if (oldIndex === newIndex) return;

      const reorderBlockFn = createReorderBlockFunction(set);

      const command = createReorderBlockCommand(
        pageId,
        blockId,
        targetId,
        reorderBlockFn
      );

      historyManager.execute(command, pageId);
    },

    reorderBlocks: (pageId, blockIds) => {
      const state = get();
      const pageKey = toKey(pageId);
      const oldBlockIds = state.blockIdsByPageId[pageKey] ?? [];

      if (JSON.stringify(oldBlockIds) === JSON.stringify(blockIds)) return;

      const reorderBlocksFn = createReorderBlocksFunction(set);

      const command = createReorderBlocksCommand(
        pageId,
        oldBlockIds,
        blockIds,
        reorderBlocksFn
      );

      historyManager.execute(command, pageId);
    },

    /**
     * =======================================================================
     * Page Actions
     * =======================================================================
     */

    addPage: (page) => {
      if (!page.id) return;

      const state = get();
      const pageIndex = state.pageIds.length;
      const addFn = createAddPageFunction(set);
      addFn(page, pageIndex);
    },

    removePage: (pageId) => {
      const state = get();
      const pageKey = toKey(pageId);
      const page = state.pageSchemaByPageId[pageKey];

      if (!page) return;

      const removeFn = createRemovePageFunction(set);
      removeFn(pageId);
    },

    updatePage: (pageId, page) => {
      const state = get();
      const pageKey = toKey(pageId);
      const oldPage = state.pageSchemaByPageId[pageKey];

      if (!oldPage) return;

      const newPage = deepMerge(oldPage, page);

      if (newPage === oldPage) return;

      const updateFn = createUpdatePageFunction(set);

      const command = createUpdatePageCommand(
        pageId,
        oldPage,
        newPage,
        updateFn
      );

      historyManager.execute(command, pageId);
    },

    reorderPage: (sourcePageId, targetPageId) => {
      const state = get();
      const sourceIndex = state.pageIds.indexOf(sourcePageId);
      const targetIndex = state.pageIds.indexOf(targetPageId);

      if (sourceIndex === -1 || targetIndex === -1) return;

      if (sourceIndex === targetIndex) return;

      const reorderPageFn = createReorderPageFunction(set);

      const command = createReorderPageCommand(
        sourcePageId,
        targetPageId,
        reorderPageFn
      );

      historyManager.execute(command, sourcePageId);
    },

    reorderPages: (pageIds) => {
      const state = get();
      const oldPageIds = state.pageIds;

      if (JSON.stringify(oldPageIds) === JSON.stringify(pageIds)) return;

      const reorderPagesFn = createReorderPagesFunction(set);

      const command = createReorderPagesCommand(
        oldPageIds,
        pageIds,
        reorderPagesFn
      );

      const firstPageId = pageIds[0] || 0;
      historyManager.execute(command, firstPageId);
    },

    upsertPages: (pages) => set((state) => upsertPagesReducer(state, pages)),

    /**
     * =======================================================================
     * History Actions
     * =======================================================================
     */

    history: historyManager,
    undo: (pageId: number) => historyManager.undo(pageId),
    redo: (pageId: number) => historyManager.redo(pageId),
    canUndo: (pageId: number) => historyManager.canUndo(pageId),
    canRedo: (pageId: number) => historyManager.canRedo(pageId),
    getHistoryState: (pageId: number) => historyManager.getHistoryState(pageId),
    clearHistory: () => historyManager.clear(),
    clearPageHistory: (pageId: number) => historyManager.clearPage(pageId),
  }));
};

const editorStore = createEditorStore();

/**
 * =======================================================================
 * Editor Hooks
 * =======================================================================
 */

export const useEditorStore = <T>(
  selector: (state: EditorStore) => T,
  deps: DependencyList = []
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedSelector = useCallback(selector, deps);
  return useStore(editorStore, memoizedSelector);
};

export const useHydrateEditor = () =>
  useEditorStore((s: EditorStore) => s.hydrate, []);

/**
 * =======================================================================
 * Block Hooks
 * =======================================================================
 */

export const useBlockById = (blockId: string) =>
  useEditorStore((s) => s.blockById[blockId] ?? null, [blockId]);

export const useBlockIdsForPage = (pageId?: number) =>
  useEditorStore(
    (s) =>
      pageId
        ? s.blockIdsByPageId[toKey(pageId)] ?? EMPTY_STRING_ARRAY
        : EMPTY_STRING_ARRAY,
    [pageId]
  );

export const useUpdateBlock = () => useEditorStore((s) => s.updateBlock, []);

export const useReorderBlock = () => useEditorStore((s) => s.reorderBlock, []);

export const useRemoveBlock = () => useEditorStore((s) => s.removeBlock, []);

export const useAddBlock = () => useEditorStore((s) => s.addBlock, []);

export const useBlockOrder = (pageId: number) =>
  useEditorStore(
    (s) => s.blockIdsByPageId[toKey(pageId)] ?? EMPTY_STRING_ARRAY,
    [pageId]
  );

export const useBlockIndex = (pageId: number, blockId: number) =>
  useEditorStore(
    (s) => {
      const ids = s.blockIdsByPageId[toKey(pageId)] ?? EMPTY_STRING_ARRAY;
      return ids.indexOf(toKey(blockId));
    },
    [pageId, blockId]
  );

/**
 * =======================================================================
 * Page Hooks
 * =======================================================================
 */

export const usePageById = (pageId?: number) =>
  useEditorStore(
    (s) => (pageId ? s.pageSchemaByPageId[toKey(pageId)] ?? null : null),
    [pageId]
  );

export const usePageIds = () => useEditorStore((s) => s.pageIds, []);

export const useAddPage = () => useEditorStore((s) => s.addPage, []);

export const useRemovePage = () => useEditorStore((s) => s.removePage, []);

export const useUpdatePage = () => useEditorStore((s) => s.updatePage, []);

export const useReorderPage = () => useEditorStore((s) => s.reorderPage, []);

export const useReorderPages = () => useEditorStore((s) => s.reorderPages, []);

export const useUpsertPages = () => useEditorStore((s) => s.upsertPages, []);

export const usePageIndex = (pageId: number) =>
  useEditorStore((s) => s.pageIds.indexOf(pageId), [pageId]);

/**
 * =======================================================================
 * History Hooks
 * =======================================================================
 */

export const useUndo = () => useEditorStore((s) => s.undo, []);

export const useRedo = () => useEditorStore((s) => s.redo, []);

export const useCanUndo = (pageId: number) =>
  useEditorStore((s) => (pageId > 0 ? s.canUndo(pageId) : false), [pageId]);

export const useCanRedo = (pageId: number) =>
  useEditorStore((s) => (pageId > 0 ? s.canRedo(pageId) : false), [pageId]);

export const useHistoryState = () =>
  useEditorStore((s) => s.getHistoryState, []);

export const useClearHistory = () => useEditorStore((s) => s.clearHistory, []);

export const useClearPageHistory = () =>
  useEditorStore((s) => s.clearPageHistory, []);

// ----------------------------------------------------------------------------
// Block Management Helper Functions
// ----------------------------------------------------------------------------

const createUpdateBlockFunction =
  (set: (fn: (state: EditorState) => EditorState) => void) =>
  <K extends keyof typeof BlockSchemaByType>(
    id: number,
    blockType: K,
    updates: Partial<BlockOf<K>> | ((prev: BlockOf<K>) => Partial<BlockOf<K>>)
  ) => {
    set((prevState: EditorState) => {
      const key = toKey(id);
      const prev = prevState.blockById[key];
      if (!prev || prev.type !== blockType) return prevState;

      const partial = typeof updates === "function" ? updates(prev) : updates;

      if (!partial || partial === prev) return prevState;

      const next = deepMerge(prev, partial);

      if (next === prev) return prevState;

      return {
        ...prevState,
        blockById: { ...prevState.blockById, [key]: next },
        pageSchemaByPageId: prevState.pageSchemaByPageId,
        pageIds: prevState.pageIds,
      };
    });
  };

const createRemoveBlockFunction =
  (set: (fn: (state: EditorState) => EditorState) => void) =>
  (pageId: number, blockId: number) => {
    set((state: EditorState) => {
      const pageKey = toKey(pageId);
      const blockKey = toKey(blockId);
      const rest = { ...state.blockById };
      delete rest[blockKey];
      const filtered = (state.blockIdsByPageId[pageKey] ?? []).filter(
        (id) => id !== blockKey
      );
      return {
        ...state,
        blockById: rest,
        blockIdsByPageId: { ...state.blockIdsByPageId, [pageKey]: filtered },
      };
    });
  };

const createAddBlockFunction =
  (set: (fn: (state: EditorState) => EditorState) => void) =>
  (pageId: number, block: BlockSchema, index: number) => {
    set((state: EditorState) => {
      const pageKey = toKey(pageId);
      const blockKey = toKey(block.id!);
      const newById = { ...state.blockById, [blockKey]: block };
      const newBlockIds = [...(state.blockIdsByPageId[pageKey] ?? [])];
      newBlockIds.splice(index, 0, blockKey);

      return {
        ...state,
        blockById: newById,
        blockIdsByPageId: { ...state.blockIdsByPageId, [pageKey]: newBlockIds },
      };
    });
  };

const createReorderBlockFunction =
  (set: (fn: (state: EditorState) => EditorState) => void) =>
  (pageId: number, sourceBlockId: number, targetBlockId: number) => {
    set((state: EditorState) => {
      const pageKey = toKey(pageId);
      const sourceKey = toKey(sourceBlockId);
      const targetKey = toKey(targetBlockId);
      const blockIds = state.blockIdsByPageId[pageKey] ?? [];
      const sourceIndex = blockIds.indexOf(sourceKey);
      const targetIndex = blockIds.indexOf(targetKey);

      if (sourceIndex === -1 || targetIndex === -1) return state;

      // Create the new order by moving the source block to target position
      const newBlockIds = [...blockIds];
      newBlockIds.splice(sourceIndex, 1);
      newBlockIds.splice(targetIndex, 0, sourceKey);

      return {
        ...state,
        blockIdsByPageId: { ...state.blockIdsByPageId, [pageKey]: newBlockIds },
      };
    });
  };

const createReorderBlocksFunction =
  (set: (fn: (state: EditorState) => EditorState) => void) =>
  (pageId: number, blockIds: string[]) => {
    set((state: EditorState) => ({
      ...state,
      blockIdsByPageId: {
        ...state.blockIdsByPageId,
        [toKey(pageId)]: blockIds,
      },
    }));
  };

// ----------------------------------------------------------------------------
// Page Management Helper Functions
// ----------------------------------------------------------------------------

const createAddPageFunction =
  (set: (fn: (state: EditorState) => EditorState) => void) =>
  (page: PageSchema, index: number) => {
    set((state: EditorState) => {
      if (!page.id) return state;

      const pageKey = toKey(page.id);
      const newPageSchema = {
        ...state.pageSchemaByPageId,
        [pageKey]: page,
      };
      const newPageIds = [...state.pageIds];
      newPageIds.splice(index, 0, page.id);

      return {
        ...state,
        pageSchemaByPageId: newPageSchema,
        pageIds: newPageIds,
      };
    });
  };

const createRemovePageFunction =
  (set: (fn: (state: EditorState) => EditorState) => void) =>
  (pageId: number) => {
    set((state: EditorState) => {
      const pageKey = toKey(pageId);
      const newPageSchema = { ...state.pageSchemaByPageId };
      delete newPageSchema[pageKey];
      const newPageIds = state.pageIds.filter((id) => id !== pageId);

      return {
        ...state,
        pageSchemaByPageId: newPageSchema,
        pageIds: newPageIds,
      };
    });
  };

const createUpdatePageFunction =
  (set: (fn: (state: EditorState) => EditorState) => void) =>
  (pageId: number, page: PageSchema) => {
    set((state: EditorState) => {
      const pageKey = toKey(pageId);
      return {
        ...state,
        pageSchemaByPageId: {
          ...state.pageSchemaByPageId,
          [pageKey]: page,
        },
      };
    });
  };

const createReorderPageFunction =
  (set: (fn: (state: EditorState) => EditorState) => void) =>
  (sourcePageId: number, targetPageId: number) => {
    set((state: EditorState) => {
      const sourceIndex = state.pageIds.indexOf(sourcePageId);
      const targetIndex = state.pageIds.indexOf(targetPageId);

      if (sourceIndex === -1 || targetIndex === -1) return state;

      // Create the new order by moving the source page to target position
      const newPageIds = [...state.pageIds];
      newPageIds.splice(sourceIndex, 1);
      newPageIds.splice(targetIndex, 0, sourcePageId);

      return {
        ...state,
        pageIds: newPageIds,
      };
    });
  };

const createReorderPagesFunction =
  (set: (fn: (state: EditorState) => EditorState) => void) =>
  (pageIds: number[]) => {
    set((state: EditorState) => ({
      ...state,
      pageIds,
    }));
  };

const sortPagesByOrder = (
  a: number,
  b: number,
  pageSchemaByPageId: Record<string, PageSchema>
) => {
  const pageA = pageSchemaByPageId[toKey(a)];
  const pageB = pageSchemaByPageId[toKey(b)];
  return (pageA?.order || 0) - (pageB?.order || 0);
};

const upsertPagesReducer = (
  state: EditorState,
  pages: PageSchema[]
): EditorState => {
  const newPageSchema = { ...state.pageSchemaByPageId };
  const newPageIds: number[] = [];

  for (const page of pages) {
    if (page.id) {
      const pageKey = toKey(page.id);
      newPageSchema[pageKey] = page;
      newPageIds.push(page.id);
    }
  }

  newPageIds.sort((a, b) => sortPagesByOrder(a, b, newPageSchema));

  return {
    ...state,
    pageSchemaByPageId: newPageSchema,
    pageIds: newPageIds,
  };
};
