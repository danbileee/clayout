import { BlockSchemaByType } from "@clayout/interface";
import type { BlockSchema, CreateSitePageDto } from "@clayout/interface";
import { nanoid } from "nanoid";

// ----------------------------------------------------------------------------
// Command Types and Interfaces
// ----------------------------------------------------------------------------

export const CommandTypes = {
  UPDATE_BLOCK: "UPDATE_BLOCK",
  REMOVE_BLOCK: "REMOVE_BLOCK",
  ADD_BLOCK: "ADD_BLOCK",
  REORDER_BLOCK: "REORDER_BLOCK",
  REORDER_BLOCKS: "REORDER_BLOCKS",
  UPDATE_PAGE: "UPDATE_PAGE",
  REORDER_PAGE: "REORDER_PAGE",
  REORDER_PAGES: "REORDER_PAGES",
} as const;

export type CommandType = keyof typeof CommandTypes;

export type CommandResult =
  | {
      type: typeof CommandTypes.UPDATE_BLOCK;
      params: { pageId: number; blockId: number; block: BlockSchema };
    }
  | {
      type: typeof CommandTypes.REMOVE_BLOCK;
      params: { pageId: number; blockId: number };
    }
  | {
      type: typeof CommandTypes.ADD_BLOCK;
      params: { pageId: number; block: BlockSchema; index: number };
    }
  | {
      type: typeof CommandTypes.REORDER_BLOCK;
      params: { pageId: number; sourceBlockId: number; targetBlockId: number };
    }
  | {
      type: typeof CommandTypes.REORDER_BLOCKS;
      params: { pageId: number; blockIds: string[] };
    }
  | {
      type: typeof CommandTypes.UPDATE_PAGE;
      params: { pageId: number; page: CreateSitePageDto };
    }
  | {
      type: typeof CommandTypes.REORDER_PAGE;
      params: { sourcePageId: number; targetPageId: number };
    }
  | {
      type: typeof CommandTypes.REORDER_PAGES;
      params: { pageIds: number[] };
    };

interface Command {
  readonly id: string;
  readonly description: string;
  readonly timestamp: number;
  readonly type: CommandType;

  execute(): CommandResult;
  undo(): CommandResult;

  getAffectedBlocks(): number[];
  getAffectedPages(): number[];
}

function createBaseCommand(type: CommandType, description: string): Command {
  const id = `${type}_${Date.now()}_${nanoid(8)}`;
  const timestamp = Date.now();

  return {
    id,
    description,
    timestamp,
    type,
    execute: () => {
      throw new Error("execute() must be implemented");
    },
    undo: () => {
      throw new Error("undo() must be implemented");
    },
    getAffectedBlocks: () => {
      throw new Error("getAffectedBlocks() must be implemented");
    },
    getAffectedPages: () => {
      throw new Error("getAffectedPages() must be implemented");
    },
  };
}

// ----------------------------------------------------------------------------
// History Manager
// ----------------------------------------------------------------------------

export function createHistoryManager() {
  let historyByPage: Record<number, Command[]> = {};
  let currentIndexByPage: Record<number, number> = {};
  const maxHistorySize = 50;
  let isExecuting = false; // Prevents recursive execution

  /**
   * @canUndo
   * - Must have commands in history for the given page
   * - Current index must be >= 0 (we've executed at least one command)
   * - Not currently executing a command
   */
  function canUndo(pageId: number): boolean {
    const history = historyByPage[pageId] || [];
    const currentIndex = currentIndexByPage[pageId] ?? -1;
    return !isExecuting && history.length > 0 && currentIndex >= 0;
  }

  /**
   * @canRedo
   * - Must have commands in history for the given page
   * - Current index must be < history.length - 1 (there are commands after current)
   * - Not currently executing a command
   */
  function canRedo(pageId: number): boolean {
    const history = historyByPage[pageId] || [];
    const currentIndex = currentIndexByPage[pageId] ?? -1;
    return (
      !isExecuting && history.length > 0 && currentIndex < history.length - 1
    );
  }

  /**
   * @execute
   * Execute a command and add it to history
   */
  function execute(command: Command, pageId: number): CommandResult | null {
    if (isExecuting) {
      // Cannot execute command while another command is executing
      return null;
    }

    isExecuting = true;

    try {
      // Initialize history for page if it doesn't exist
      if (!historyByPage[pageId]) {
        historyByPage[pageId] = [];
        currentIndexByPage[pageId] = -1;
      }

      const history = historyByPage[pageId];
      const currentIndex = currentIndexByPage[pageId];

      // Remove any "future" history if we're not at the end
      // This happens when user undoes some commands and then performs a new action
      if (currentIndex < history.length - 1) {
        historyByPage[pageId] = history.slice(0, currentIndex + 1);
      }

      // Execute the command
      const result = command.execute();

      // Add to history
      historyByPage[pageId].push(command);
      currentIndexByPage[pageId] = historyByPage[pageId].length - 1;

      // Limit history size
      if (historyByPage[pageId].length > maxHistorySize) {
        historyByPage[pageId].shift();
        currentIndexByPage[pageId]--;
      }

      return result;
    } finally {
      isExecuting = false;
    }
  }

  /**
   * @undo
   * Undo the last executed command for the specified page
   */
  function undo(pageId: number): CommandResult | null {
    if (!canUndo(pageId)) {
      return null;
    }

    isExecuting = true;

    try {
      const history = historyByPage[pageId];
      const currentIndex = currentIndexByPage[pageId];
      const command = history[currentIndex];
      const result = command.undo();
      currentIndexByPage[pageId] = currentIndex - 1;
      return result;
    } finally {
      isExecuting = false;
    }
  }

  /**
   * @redo
   * Redo the next command in history for the specified page
   */
  function redo(pageId: number): CommandResult | null {
    if (!canRedo(pageId)) {
      return null;
    }

    isExecuting = true;

    try {
      const currentIndex = currentIndexByPage[pageId];
      currentIndexByPage[pageId] = currentIndex + 1;
      const command = historyByPage[pageId][currentIndexByPage[pageId]];
      const result = command.execute();
      return result;
    } finally {
      isExecuting = false;
    }
  }

  /**
   * @getHistoryState
   * Get current history state for debugging for the specified page
   */
  function getHistoryState(pageId: number) {
    const history = historyByPage[pageId] || [];
    const currentIndex = currentIndexByPage[pageId] ?? -1;

    return {
      totalCommands: history.length,
      currentIndex: currentIndex,
      canUndo: canUndo(pageId),
      canRedo: canRedo(pageId),
      recentCommands: history.slice(-5).map((cmd) => ({
        id: cmd.id,
        type: cmd.type,
        description: cmd.description,
        timestamp: cmd.timestamp,
      })),
    };
  }

  /**
   * @clear
   * Clear all history for all pages
   */
  function clear(): void {
    historyByPage = {};
    currentIndexByPage = {};
  }

  /**
   * @clearPage
   * Clear history for a specific page
   */
  function clearPage(pageId: number): void {
    delete historyByPage[pageId];
    delete currentIndexByPage[pageId];
  }

  return {
    execute,
    undo,
    redo,
    canUndo,
    canRedo,
    getHistoryState,
    clear,
    clearPage,
  };
}

export type HistoryManager = ReturnType<typeof createHistoryManager>;

// ----------------------------------------------------------------------------
// Block Commands
// ----------------------------------------------------------------------------

export function createUpdateBlockCommand(
  blockId: number,
  pageId: number,
  oldBlock: BlockSchema,
  newBlock: BlockSchema,
  updateBlockFn: (
    blockId: number,
    type: keyof typeof BlockSchemaByType,
    updates: Partial<BlockSchema>
  ) => void
): Command {
  return {
    ...createBaseCommand(CommandTypes.UPDATE_BLOCK, `Update block ${blockId}`),
    execute: () => {
      if (newBlock.type) {
        updateBlockFn(blockId, newBlock.type, newBlock);
      }
      return {
        type: CommandTypes.UPDATE_BLOCK,
        params: { pageId, blockId, block: newBlock },
      };
    },
    undo: () => {
      if (oldBlock.type) {
        updateBlockFn(blockId, oldBlock.type, oldBlock);
      }
      return {
        type: CommandTypes.UPDATE_BLOCK,
        params: { pageId, blockId, block: oldBlock },
      };
    },
    getAffectedBlocks: () => [blockId],
    getAffectedPages: () => [pageId],
  };
}

export function createRemoveBlockCommand(
  pageId: number,
  blockId: number,
  removedBlock: BlockSchema,
  blockIndex: number, // Position where block was removed
  removeBlockFn: (pageId: number, blockId: number) => void,
  addBlockFn: (pageId: number, block: BlockSchema, index: number) => void
): Command {
  return {
    ...createBaseCommand(CommandTypes.REMOVE_BLOCK, `Remove block ${blockId}`),
    execute: () => {
      removeBlockFn(pageId, blockId);
      return {
        type: CommandTypes.REMOVE_BLOCK,
        params: { pageId, blockId },
      };
    },
    undo: () => {
      // Restore the block at its original position
      addBlockFn(pageId, removedBlock, blockIndex);
      return {
        type: CommandTypes.ADD_BLOCK,
        params: { pageId, block: removedBlock, index: blockIndex },
      };
    },
    getAffectedBlocks: () => [blockId],
    getAffectedPages: () => [pageId],
  };
}

export function createReorderBlockCommand(
  pageId: number,
  sourceBlockId: number,
  targetBlockId: number,
  reorderBlockFn: (
    pageId: number,
    sourceBlockId: number,
    targetBlockId: number
  ) => void
): Command {
  return {
    ...createBaseCommand(
      CommandTypes.REORDER_BLOCK,
      `Reorder block ${sourceBlockId} to ${targetBlockId}`
    ),
    execute: () => {
      reorderBlockFn(pageId, sourceBlockId, targetBlockId);
      return {
        type: CommandTypes.REORDER_BLOCK,
        params: { pageId, sourceBlockId, targetBlockId },
      };
    },
    undo: () => {
      reorderBlockFn(pageId, sourceBlockId, targetBlockId);
      return {
        type: CommandTypes.REORDER_BLOCK,
        params: {
          pageId,
          sourceBlockId: targetBlockId,
          targetBlockId: sourceBlockId,
        },
      };
    },
    getAffectedBlocks: () => [sourceBlockId, targetBlockId],
    getAffectedPages: () => [pageId],
  };
}

export function createReorderBlocksCommand(
  pageId: number,
  oldBlockIds: string[],
  newBlockIds: string[],
  reorderBlocksFn: (pageId: number, blockIds: string[]) => void
): Command {
  return {
    ...createBaseCommand(
      CommandTypes.REORDER_BLOCKS,
      `Reorder blocks on page ${pageId}`
    ),
    execute: () => {
      reorderBlocksFn(pageId, newBlockIds);
      return {
        type: CommandTypes.REORDER_BLOCKS,
        params: { pageId, blockIds: newBlockIds },
      };
    },
    undo: () => {
      // Restore the original order
      reorderBlocksFn(pageId, oldBlockIds);
      return {
        type: CommandTypes.REORDER_BLOCKS,
        params: { pageId, blockIds: oldBlockIds },
      };
    },
    getAffectedBlocks: () => {
      // Get all unique block IDs from both arrays
      const allIds = Array.from(new Set([...oldBlockIds, ...newBlockIds]));
      return allIds.map((id) => parseInt(id));
    },
    getAffectedPages: () => [pageId],
  };
}

export function createAddBlockCommand(
  pageId: number,
  block: BlockSchema,
  blockIndex: number,
  addBlockFn: (pageId: number, block: BlockSchema, index: number) => void,
  removeBlockFn: (pageId: number, blockId: number) => void
): Command {
  return {
    ...createBaseCommand(CommandTypes.ADD_BLOCK, `Add block ${block.id}`),
    execute: () => {
      addBlockFn(pageId, block, blockIndex);
      return {
        type: CommandTypes.ADD_BLOCK,
        params: { pageId, block, index: blockIndex },
      };
    },
    undo: () => {
      if (block.id) {
        removeBlockFn(pageId, block.id);
      }
      return {
        type: CommandTypes.REMOVE_BLOCK,
        params: { pageId, blockId: block.id! },
      };
    },
    getAffectedBlocks: () => (block.id ? [block.id] : []),
    getAffectedPages: () => [pageId],
  };
}

// ----------------------------------------------------------------------------
// Page Commands
// ----------------------------------------------------------------------------

export function createUpdatePageCommand(
  pageId: number,
  oldPage: CreateSitePageDto,
  newPage: CreateSitePageDto,
  updatePageFn: (pageId: number, page: CreateSitePageDto) => void
): Command {
  return {
    ...createBaseCommand(CommandTypes.UPDATE_PAGE, `Update page ${pageId}`),
    execute: () => {
      updatePageFn(pageId, newPage);
      return {
        type: CommandTypes.UPDATE_PAGE,
        params: { pageId, page: newPage },
      };
    },
    undo: () => {
      updatePageFn(pageId, oldPage);
      return {
        type: CommandTypes.UPDATE_PAGE,
        params: { pageId, page: oldPage },
      };
    },
    getAffectedBlocks: () => [],
    getAffectedPages: () => [pageId],
  };
}

export function createReorderPageCommand(
  sourcePageId: number,
  targetPageId: number,
  reorderPageFn: (sourcePageId: number, targetPageId: number) => void
): Command {
  return {
    ...createBaseCommand(
      CommandTypes.REORDER_PAGE,
      `Reorder page ${sourcePageId} to ${targetPageId}`
    ),
    execute: () => {
      reorderPageFn(sourcePageId, targetPageId);
      return {
        type: CommandTypes.REORDER_PAGE,
        params: { sourcePageId, targetPageId },
      };
    },
    undo: () => {
      reorderPageFn(sourcePageId, targetPageId);
      return {
        type: CommandTypes.REORDER_PAGE,
        params: {
          sourcePageId: targetPageId,
          targetPageId: sourcePageId,
        },
      };
    },
    getAffectedBlocks: () => [],
    getAffectedPages: () => [sourcePageId, targetPageId],
  };
}

export function createReorderPagesCommand(
  oldPageIds: number[],
  newPageIds: number[],
  reorderPagesFn: (pageIds: number[]) => void
): Command {
  return {
    ...createBaseCommand(CommandTypes.REORDER_PAGES, `Reorder pages`),
    execute: () => {
      reorderPagesFn(newPageIds);
      return {
        type: CommandTypes.REORDER_PAGES,
        params: { pageIds: newPageIds },
      };
    },
    undo: () => {
      // Restore the original order
      reorderPagesFn(oldPageIds);
      return {
        type: CommandTypes.REORDER_PAGES,
        params: { pageIds: oldPageIds },
      };
    },
    getAffectedBlocks: () => [],
    getAffectedPages: () => {
      // Get all unique page IDs from both arrays
      const allIds = Array.from(new Set([...oldPageIds, ...newPageIds]));
      return allIds;
    },
  };
}
