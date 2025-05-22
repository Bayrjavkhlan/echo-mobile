import {
  syncUnsyncedForTable,
  pullChangesForTable,
  checkConnection,
} from "./syncService";

// Available tables for sync
export const SYNC_TABLES = [
  "flashcards",
  "groups",
  "labels",
  "flashcardLabels",
  "reviews",
  "wrongAnswers",
  "calendar",
];

type SyncResult = {
  success: boolean;
  message: string;
  details?: Record<string, any>;
};

/**
 * Performs full synchronization in both directions:
 * 1. Push local changes to server (upload)
 * 2. Pull server changes to local (download)
 */
export const performFullSync = async (): Promise<SyncResult> => {
  // Check internet connection first
  const isConnected = await checkConnection();
  if (!isConnected) {
    return {
      success: false,
      message: "No internet connection available. Sync aborted.",
    };
  }

  const results: Record<string, any> = {};
  let hasErrors = false;

  // First push all local changes to server
  for (const table of SYNC_TABLES) {
    try {
      const pushResult = await syncUnsyncedForTable(table);
      results[`push_${table}`] = pushResult;

      if (!pushResult.success) {
        hasErrors = true;
      }
    } catch (error) {
      // nuguu
      // console.error(`Error syncing ${table} to server:`, error);
      results[`push_${table}`] = {
        success: false,
        message: `Failed to sync ${table} due to error`,
      };
      hasErrors = true;
    }
  }

  // Then pull all server changes
  for (const table of SYNC_TABLES) {
    try {
      const pullResult = await pullChangesForTable(table);
      results[`pull_${table}`] = pullResult;

      if (!pullResult.success) {
        hasErrors = true;
      }
    } catch (error) {
      console.error(`Error pulling ${table} from server:`, error);
      results[`pull_${table}`] = {
        success: false,
        message: `Failed to pull ${table} due to error`,
      };
      hasErrors = true;
    }
  }

  return {
    success: !hasErrors,
    message: hasErrors
      ? "Sync completed with some errors. Check details."
      : "Sync completed successfully!",
    details: results,
  };
};

/**
 * Push local changes to the server for a specific table
 */
export const pushChangesForTable = async (
  tableName: string
): Promise<SyncResult> => {
  try {
    if (!SYNC_TABLES.includes(tableName)) {
      return {
        success: false,
        message: `Invalid table name: ${tableName}`,
      };
    }

    const result = await syncUnsyncedForTable(tableName);
    return {
      success: result.success,
      message: result.message,
      details: { [tableName]: result },
    };
  } catch (error) {
    console.error(`Error pushing changes for ${tableName}:`, error);
    return {
      success: false,
      message: `Failed to push changes for ${tableName} due to error`,
      details: { error },
    };
  }
};

/**
 * Pull server changes to local for a specific table
 */
export const pullServerChangesForTable = async (
  tableName: string
): Promise<SyncResult> => {
  try {
    if (!SYNC_TABLES.includes(tableName)) {
      return {
        success: false,
        message: `Invalid table name: ${tableName}`,
      };
    }

    const result = await pullChangesForTable(tableName);
    return {
      success: result.success,
      message: result.message,
      details: { [tableName]: result },
    };
  } catch (error) {
    console.error(`Error pulling changes for ${tableName}:`, error);
    return {
      success: false,
      message: `Failed to pull changes for ${tableName} due to error`,
      details: { error },
    };
  }
};

/**
 * Push all local changes to the server (all tables)
 */
export const pushAllLocalChanges = async (): Promise<SyncResult> => {
  // Check internet connection first
  const isConnected = await checkConnection();
  if (!isConnected) {
    return {
      success: false,
      message: "No internet connection available. Push aborted.",
    };
  }

  const results: Record<string, any> = {};
  let hasErrors = false;

  for (const table of SYNC_TABLES) {
    try {
      const result = await syncUnsyncedForTable(table);
      results[table] = result;

      if (!result.success) {
        hasErrors = true;
      }
    } catch (error) {
      // console.error(`Error syncing ${table} to server:`, error);
      results[table] = {
        success: false,
        message: `Failed to sync ${table} due to error`,
      };
      hasErrors = true;
    }
  }

  return {
    success: !hasErrors,
    message: hasErrors
      ? "Push completed with some errors. Check details."
      : "Push completed successfully!",
    details: results,
  };
};

/**
 * Pull all server changes to local (all tables)
 */
export const pullAllServerChanges = async (): Promise<SyncResult> => {
  // Check internet connection first
  const isConnected = await checkConnection();
  if (!isConnected) {
    return {
      success: false,
      message: "No internet connection available. Pull aborted.",
    };
  }

  const results: Record<string, any> = {};
  let hasErrors = false;

  for (const table of SYNC_TABLES) {
    try {
      const result = await pullChangesForTable(table);
      results[table] = result;

      if (!result.success) {
        hasErrors = true;
      }
    } catch (error) {
      console.error(`Error pulling ${table} from server:`, error);
      results[table] = {
        success: false,
        message: `Failed to pull ${table} due to error`,
      };
      hasErrors = true;
    }
  }

  return {
    success: !hasErrors,
    message: hasErrors
      ? "Pull completed with some errors. Check details."
      : "Pull completed successfully!",
    details: results,
  };
};
