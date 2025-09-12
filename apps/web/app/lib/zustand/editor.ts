import { createStore } from "zustand";
import { useStore } from "zustand/react";
import { BlockSchemaByType } from "@clayout/interface";
import type { BlockSchema, BlockOf } from "@clayout/interface";

// ----------------------------------------------------------------------------
// Blocks Store
// ----------------------------------------------------------------------------

export type BlocksState = {
  byId: Record<string, BlockSchema>;
  idsByPageId: Record<string, string[]>;
};

export type BlocksActions = {
  upsertBlocks: (pageId: number, blocks: BlockSchema[]) => void;
  upsertBlock: (pageId: number, block: BlockSchema) => void;
  updateBlockData: (
    blockId: number,
    updater: (prev: BlockSchema) => BlockSchema
  ) => void;
  updateBlock: <K extends keyof typeof BlockSchemaByType>(
    blockId: number,
    type: K,
    updater: (prev: BlockOf<K>) => BlockOf<K>
  ) => void;
  removeBlock: (pageId: number, blockId: number) => void;
  reorderBlock: (pageId: number, blockId: number, newIndex: number) => void;
  reorderBlocks: (pageId: number, blockIds: string[]) => void;
};

export type BlocksStore = BlocksState & BlocksActions;

const toKey = (id: number) => String(id);

export const createBlocksStore = () =>
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

    // Performance-oriented: only replace the specific block entry
    updateBlockData: (blockId, updater) =>
      set((state) => updateBlockDataCompute(state, toKey(blockId), updater)),

    updateBlock: (blockId, type, updater) => {
      set((state) =>
        updateBlockDataAsCompute(state, toKey(blockId), type, updater)
      );
    },

    removeBlock: (pageId, blockId) =>
      set((state) =>
        removeBlockFromState(state, toKey(pageId), toKey(blockId))
      ),

    // Block ordering actions
    reorderBlock: (pageId, blockId, newIndex) =>
      set((state) =>
        reorderBlockInState(state, toKey(pageId), toKey(blockId), newIndex)
      ),

    reorderBlocks: (pageId, blockIds) =>
      set((state) => ({
        ...state,
        idsByPageId: { ...state.idsByPageId, [toKey(pageId)]: blockIds },
      })),
  }));

export const blocksStore = createBlocksStore();

export const useBlocksStore = <T>(selector: (state: BlocksStore) => T) =>
  useStore(blocksStore, selector);

// Selectors for performance subscriptions
export const selectBlockById = (blockId: number) => (s: BlocksStore) =>
  s.byId[toKey(blockId)] ?? null;
export const selectBlocksForPage = (pageId: number) => (s: BlocksStore) => {
  const ids = s.idsByPageId[toKey(pageId)] ?? [];
  // ensure each block carries its current order index
  return ids
    .map((id, index) => ({ block: s.byId[id], index }))
    .filter((x) => Boolean(x.block))
    .map(({ block, index }) => ({ ...block, order: index }));
};

// Block ordering selectors
export const selectBlockOrder = (pageId: number) => (s: BlocksStore) =>
  s.idsByPageId[toKey(pageId)] ?? [];

export const selectBlockIndex =
  (pageId: number, blockId: number) => (s: BlocksStore) => {
    const ids = s.idsByPageId[toKey(pageId)] ?? [];
    return ids.indexOf(toKey(blockId));
  };

// ----------------------------------------------------------------------------
// Helpers (pure) to keep lints and nesting low
// ----------------------------------------------------------------------------

function updateBlockDataCompute(
  state: BlocksState,
  key: string,
  updater: (prev: BlockSchema) => BlockSchema
): BlocksState {
  const prev = state.byId[key];
  if (!prev) return state;
  const next = updater(prev);
  if (next === prev) return state;
  return { ...state, byId: { ...state.byId, [key]: next } };
}

function updateBlockDataAsCompute<K extends keyof typeof BlockSchemaByType>(
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

export type SaveStatus = "idle" | "saving" | "saved" | "error";
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type EditorStatusState = {
  save: SaveStatus;
  auth: AuthStatus;
};

export type EditorStatusActions = {
  setSave: (status: SaveStatus) => void;
  setAuth: (status: AuthStatus) => void;
};

export type EditorStatusStore = EditorStatusState & EditorStatusActions;

export const createEditorStatusStore = () =>
  createStore<EditorStatusStore>()((set) => ({
    save: "idle",
    auth: "loading",
    setSave: (status) => set(() => ({ save: status })),
    setAuth: (status) => set(() => ({ auth: status })),
  }));

export const editorStatusStore = createEditorStatusStore();
export const useEditorStatusStore = <T>(
  selector: (state: EditorStatusStore) => T
) => useStore(editorStatusStore, selector);

export const selectSave = (s: EditorStatusStore) => s.save;
export const selectAuth = (s: EditorStatusStore) => s.auth;
