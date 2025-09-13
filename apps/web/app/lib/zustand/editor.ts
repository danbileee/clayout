import { useEffect, useRef, useCallback } from "react";
import { createStore } from "zustand";
import { useStore } from "zustand/react";
import { BlockSchemaByType } from "@clayout/interface";
import type { BlockSchema, BlockOf } from "@clayout/interface";
import type { DependencyList } from "react";

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
  updateBlock: <K extends keyof typeof BlockSchemaByType>(
    blockId: number,
    type: K,
    updater: (prev: BlockOf<K>) => BlockOf<K>
  ) => void;
  removeBlock: (pageId: number, blockId: number) => void;
  reorderBlock: (pageId: number, blockId: number, newIndex: number) => void;
  reorderBlocks: (pageId: number, blockIds: string[]) => void;
  hydrate: (data: {
    pages: Array<{ id: number; blocks: BlockSchema[] }>;
  }) => void;
};

type BlocksStore = BlocksState & BlocksActions;

const toKey = (id: number) => String(id);

const createBlocksStore = () =>
  createStore<BlocksStore>()((set) => ({
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

    updateBlock: (blockId, type, updater) => {
      set((state) => updateBlockData(state, toKey(blockId), type, updater));
    },

    removeBlock: (pageId, blockId) =>
      set((state) =>
        removeBlockFromState(state, toKey(pageId), toKey(blockId))
      ),

    reorderBlock: (pageId, blockId, newIndex) =>
      set((state) =>
        reorderBlockInState(state, toKey(pageId), toKey(blockId), newIndex)
      ),

    reorderBlocks: (pageId, blockIds) =>
      set((state) => ({
        ...state,
        idsByPageId: { ...state.idsByPageId, [toKey(pageId)]: blockIds },
      })),

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
  }));

const blocksStore = createBlocksStore();

const useBlocksStore = <T>(
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

// ----------------------------------------------------------------------------
// Helpers (pure) to keep lints and nesting low
// ----------------------------------------------------------------------------

function updateBlockData<K extends keyof typeof BlockSchemaByType>(
  state: BlocksState,
  key: string,
  type: K,
  updater: (prev: BlockOf<K>) => BlockOf<K>
): BlocksState {
  const prev = state.byId[key];
  if (!prev || prev.type !== type) return state;
  const next = updater(prev);
  if (next === prev) return state;
  return { ...state, byId: { ...state.byId, [key]: next } };
}

function removeBlockFromState(
  state: BlocksState,
  pageKey: string,
  blockKey: string
): BlocksState {
  const rest = { ...state.byId };
  delete rest[blockKey];
  const filtered = (state.idsByPageId[pageKey] ?? []).filter(
    (id) => id !== blockKey
  );
  return {
    byId: rest,
    idsByPageId: { ...state.idsByPageId, [pageKey]: filtered },
  };
}

function reorderBlockInState(
  state: BlocksState,
  pageKey: string,
  blockKey: string,
  newIndex: number
): BlocksState {
  const currentIds = state.idsByPageId[pageKey] ?? [];
  const currentIndex = currentIds.indexOf(blockKey);

  if (currentIndex === -1 || currentIndex === newIndex) return state;

  const newIds = [...currentIds];
  newIds.splice(currentIndex, 1);
  newIds.splice(newIndex, 0, blockKey);

  return {
    ...state,
    idsByPageId: { ...state.idsByPageId, [pageKey]: newIds },
  };
}

// ----------------------------------------------------------------------------
// Editor Status Store
// ----------------------------------------------------------------------------

type SaveStatus = "idle" | "saving" | "saved" | "error";
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type EditorStatusState = {
  save: SaveStatus;
  auth: AuthStatus;
};

type EditorStatusActions = {
  setSave: (status: SaveStatus) => void;
  setAuth: (status: AuthStatus) => void;
  hydrate: (state: EditorStatusState) => void;
};

type EditorStatusStore = EditorStatusState & EditorStatusActions;

const createEditorStatusStore = () =>
  createStore<EditorStatusStore>()((set) => ({
    save: "idle",
    auth: "loading",
    setSave: (status) => set(() => ({ save: status })),
    setAuth: (status) => set(() => ({ auth: status })),
    hydrate: (state) => set(() => state),
  }));

const editorStatusStore = createEditorStatusStore();

const useEditorStatusStore = <T>(
  selector: (state: EditorStatusStore) => T,
  deps: DependencyList = []
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedSelector = useCallback(selector, deps);
  return useStore(editorStatusStore, memoizedSelector);
};

export const useEditorSaveStatus = () =>
  useEditorStatusStore((s) => s.save, []);

export const useEditorAuthStatus = () =>
  useEditorStatusStore((s) => s.auth, []);

export const useUpdateEditorSaveStatus = () =>
  useEditorStatusStore((s) => s.setSave, []);

export const useUpdateEditorAuthStatus = () =>
  useEditorStatusStore((s) => s.setAuth, []);
