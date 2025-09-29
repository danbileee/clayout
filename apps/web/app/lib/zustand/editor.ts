import { useEffect, useRef, useCallback } from "react";
import { createStore } from "zustand";
import { useStore } from "zustand/react";
import { BlockSchemaByType } from "@clayout/interface";
import type { BlockSchema, BlockOf } from "@clayout/interface";
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
} from "./commands";

const EMPTY_STRING_ARRAY: string[] = [];

// ----------------------------------------------------------------------------
// Blocks Store
// ----------------------------------------------------------------------------

type BlocksState = {
  byId: Record<string, BlockSchema>;
  idsByPageId: Record<string, string[]>;
};

type BlocksActions = {
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
  hydrate: (data: {
    pages: Array<{ id: number; blocks: BlockSchema[] }>;
  }) => void;

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

export type BlocksStore = BlocksState & BlocksActions;

const toKey = (id: number) => String(id);

const createBlocksStore = () => {
  const historyManager = createHistoryManager();

  return createStore<BlocksStore>()((set, get) => ({
    byId: {},
    idsByPageId: {},

    upsertBlocks: (pageId, blocks) =>
      set((state) => {
        const pageKey = toKey(pageId);
        const newById = { ...state.byId };
        const blockIds: string[] = [];

        for (const block of blocks) {
          const key = toKey(block.id!);
          newById[key] = block;
          blockIds.push(key);
        }

        return {
          byId: newById,
          idsByPageId: { ...state.idsByPageId, [pageKey]: blockIds },
        };
      }),

    upsertBlock: (pageId, block) =>
      set((state) => {
        const pageKey = toKey(pageId);
        const blockKey = toKey(block.id!);
        const existing = state.idsByPageId[pageKey] ?? [];
        const hasId = existing.includes(blockKey);
        return {
          byId: { ...state.byId, [blockKey]: block },
          idsByPageId: {
            ...state.idsByPageId,
            [pageKey]: hasId ? existing : [...existing, blockKey],
          },
        };
      }),

    updateBlock: (
      blockId: number,
      _type: keyof typeof BlockSchemaByType,
      third:
        | Partial<BlockSchema>
        | ((prev: BlockSchema) => Partial<BlockSchema>)
    ) => {
      const state = get();
      const blockKey = toKey(blockId);
      const oldBlock = state.byId[blockKey];

      if (!oldBlock) return;

      // Calculate new block data
      const partial = typeof third === "function" ? third(oldBlock) : third;

      if (!partial || partial === oldBlock) return;

      const newBlock = deepMerge(oldBlock, partial);

      if (newBlock === oldBlock) return;

      // Find the page ID for this block
      const pageId = Object.entries(state.idsByPageId).find(([, blockIds]) =>
        blockIds.includes(blockKey)
      )?.[0];

      if (!pageId) return;

      const updateFn = createUpdateFunction(set);

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
      const blockIds = state.idsByPageId[pageKey] ?? [];
      const addFn = createAddFunction(set);
      const removeFn = createRemoveFunction(set);

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
      const block = state.byId[blockKey];
      const blockIds = state.idsByPageId[pageKey] ?? [];
      const blockIndex = blockIds.indexOf(blockKey);

      if (!block || blockIndex === -1) return;

      const removeFn = createRemoveFunction(set);
      const addFn = createAddFunction(set);

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
      const blockIds = state.idsByPageId[pageKey] ?? [];
      const oldIndex = blockIds.indexOf(blockKey);
      const newIndex = blockIds.indexOf(targetKey);

      if (oldIndex === -1 || newIndex === -1) return;

      // Only create a command if the order actually changed
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
      const oldBlockIds = state.idsByPageId[pageKey] ?? [];

      // Only create a command if the order actually changed
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

    hydrate: (data) =>
      set((state) => {
        const newById = { ...state.byId };
        const newIdsByPageId = { ...state.idsByPageId };

        for (const page of data.pages) {
          const pageKey = toKey(page.id);
          const blockIds: string[] = [];

          for (const block of page.blocks) {
            const blockKey = toKey(block.id!);
            newById[blockKey] = block;
            blockIds.push(blockKey);
          }

          newIdsByPageId[pageKey] = blockIds;
        }

        return {
          byId: newById,
          idsByPageId: newIdsByPageId,
        };
      }),

    // History management actions
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

const blocksStore = createBlocksStore();

export const useBlocksStore = <T>(
  selector: (state: BlocksStore) => T,
  deps: DependencyList = []
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedSelector = useCallback(selector, deps);
  return useStore(blocksStore, memoizedSelector);
};

export const useHydrateBlocksStore = (data: {
  pages: Array<{ id: number; blocks: BlockSchema[] }>;
}) => {
  const hydrate = useBlocksStore((s) => s.hydrate);
  const hydrateRef = useRef(hydrate);

  hydrateRef.current = hydrate;

  useEffect(() => {
    if (data.pages.length > 0) {
      hydrateRef.current(data);
    }
  }, [data]);
};

export const useBlockById = (blockId: string) =>
  useBlocksStore((s) => s.byId[blockId] ?? null, [blockId]);

export const useBlockIdsForPage = (pageId?: number) =>
  useBlocksStore(
    (s) =>
      pageId
        ? s.idsByPageId[toKey(pageId)] ?? EMPTY_STRING_ARRAY
        : EMPTY_STRING_ARRAY,
    [pageId]
  );

export const useUpdateBlock = () => useBlocksStore((s) => s.updateBlock, []);

export const useReorderBlock = () => useBlocksStore((s) => s.reorderBlock, []);

export const useRemoveBlock = () => useBlocksStore((s) => s.removeBlock, []);

export const useAddBlock = () => useBlocksStore((s) => s.addBlock, []);

export const useBlockOrder = (pageId: number) =>
  useBlocksStore(
    (s) => s.idsByPageId[toKey(pageId)] ?? EMPTY_STRING_ARRAY,
    [pageId]
  );

export const useBlockIndex = (pageId: number, blockId: number) =>
  useBlocksStore(
    (s) => {
      const ids = s.idsByPageId[toKey(pageId)] ?? EMPTY_STRING_ARRAY;
      return ids.indexOf(toKey(blockId));
    },
    [pageId, blockId]
  );

export const useUndo = () => useBlocksStore((s) => s.undo, []);

export const useRedo = () => useBlocksStore((s) => s.redo, []);

export const useCanUndo = (pageId: number) =>
  useBlocksStore((s) => (pageId > 0 ? s.canUndo(pageId) : false), [pageId]);

export const useCanRedo = (pageId: number) =>
  useBlocksStore((s) => (pageId > 0 ? s.canRedo(pageId) : false), [pageId]);

export const useHistoryState = () =>
  useBlocksStore((s) => s.getHistoryState, []);

export const useClearHistory = () => useBlocksStore((s) => s.clearHistory, []);

export const useClearPageHistory = () =>
  useBlocksStore((s) => s.clearPageHistory, []);

// ----------------------------------------------------------------------------
// Helpers (pure) to keep lints and nesting low
// ----------------------------------------------------------------------------

const createUpdateFunction =
  (set: (fn: (state: BlocksState) => BlocksState) => void) =>
  <K extends keyof typeof BlockSchemaByType>(
    id: number,
    blockType: K,
    updates: Partial<BlockOf<K>> | ((prev: BlockOf<K>) => Partial<BlockOf<K>>)
  ) => {
    set((prevState: BlocksState) => {
      const key = toKey(id);
      const prev = prevState.byId[key];
      if (!prev || prev.type !== blockType) return prevState;

      const partial = typeof updates === "function" ? updates(prev) : updates;

      if (!partial || partial === prev) return prevState;

      const next = deepMerge(prev, partial);

      if (next === prev) return prevState;

      return { ...prevState, byId: { ...prevState.byId, [key]: next } };
    });
  };

const createRemoveFunction =
  (set: (fn: (state: BlocksState) => BlocksState) => void) =>
  (pageId: number, blockId: number) => {
    set((state: BlocksState) => {
      const pageKey = toKey(pageId);
      const blockKey = toKey(blockId);
      const rest = { ...state.byId };
      delete rest[blockKey];
      const filtered = (state.idsByPageId[pageKey] ?? []).filter(
        (id) => id !== blockKey
      );
      return {
        byId: rest,
        idsByPageId: { ...state.idsByPageId, [pageKey]: filtered },
      };
    });
  };

const createAddFunction =
  (set: (fn: (state: BlocksState) => BlocksState) => void) =>
  (pageId: number, block: BlockSchema, index: number) => {
    set((state: BlocksState) => {
      const pageKey = toKey(pageId);
      const blockKey = toKey(block.id!);
      const newById = { ...state.byId, [blockKey]: block };
      const newBlockIds = [...(state.idsByPageId[pageKey] ?? [])];
      newBlockIds.splice(index, 0, blockKey);

      return {
        byId: newById,
        idsByPageId: { ...state.idsByPageId, [pageKey]: newBlockIds },
      };
    });
  };

const createReorderBlockFunction =
  (set: (fn: (state: BlocksState) => BlocksState) => void) =>
  (pageId: number, sourceBlockId: number, targetBlockId: number) => {
    set((state: BlocksState) => {
      const pageKey = toKey(pageId);
      const sourceKey = toKey(sourceBlockId);
      const targetKey = toKey(targetBlockId);
      const blockIds = state.idsByPageId[pageKey] ?? [];
      const sourceIndex = blockIds.indexOf(sourceKey);
      const targetIndex = blockIds.indexOf(targetKey);

      if (sourceIndex === -1 || targetIndex === -1) return state;

      // Create the new order by moving the source block to target position
      const newBlockIds = [...blockIds];
      newBlockIds.splice(sourceIndex, 1);
      newBlockIds.splice(targetIndex, 0, sourceKey);

      return {
        ...state,
        idsByPageId: { ...state.idsByPageId, [pageKey]: newBlockIds },
      };
    });
  };

const createReorderBlocksFunction =
  (set: (fn: (state: BlocksState) => BlocksState) => void) =>
  (pageId: number, blockIds: string[]) => {
    set((state: BlocksState) => ({
      ...state,
      idsByPageId: { ...state.idsByPageId, [toKey(pageId)]: blockIds },
    }));
  };
