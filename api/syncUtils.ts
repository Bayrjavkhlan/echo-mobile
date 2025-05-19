import * as syncService from "./syncService";
import SQLiteService from "./sqliteService";
import { SYNC_TABLES } from "./syncManager";
import { checkConnection } from "./syncService";

/**
 * Utility functions for sync debugging and testing
 */

/**
 * Get the sync status for all tables
 */
export const getSyncStatus = async () => {
  const result: Record<string, any> = {};

  for (const table of SYNC_TABLES) {
    try {
      // Get all unsynced items for this table
      const items = await syncService.getUnsyncedItems(table);
      result[table] = {
        unsyncedCount: items.length,
        items: items.slice(0, 5), // Include only the first 5 items to avoid too much data
      };
    } catch (error) {
      result[table] = { error: error.message };
    }
  }

  // Add connection status
  result._connection = await checkConnection();

  return result;
};

/**
 * Debug function to set isSync flag manually for testing
 */
export const markItemsAsUnsynced = async (
  tableName: string,
  count: number = 5
) => {
  if (!SYNC_TABLES.includes(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  try {
    // Convert tableName to DB format
    const dbTableName = convertTableNameForDb(tableName);

    // Set isSync to 0 for a few items to trigger sync
    if (tableName === "flashcardLabels") {
      // For composite key table
      await SQLiteService.executeQuery(
        `UPDATE flashcard_labels SET isSync = 0 LIMIT ?`,
        [count]
      );
    } else {
      // For regular tables
      await SQLiteService.executeQuery(
        `UPDATE ${dbTableName} SET isSync = 0 LIMIT ?`,
        [count]
      );
    }

    return {
      success: true,
      message: `Marked ${count} items as unsynced in ${tableName}`,
    };
  } catch (error) {
    console.error(`Error marking items as unsynced for ${tableName}:`, error);
    return { success: false, error: error.message };
  }
};

// Helper function to convert table name for DB
const convertTableNameForDb = (tableName: string): string => {
  switch (tableName) {
    case "flashcards":
      return "flashcards";
    case "groups":
      return "groups";
    case "labels":
      return "labels";
    case "flashcardLabels":
      return "flashcard_labels";
    case "reviews":
      return "reviews";
    case "wrongAnswers":
      return "wrong_answers";
    case "calendar":
      return "calendar";
    default:
      return tableName;
  }
};

export default {
  getSyncStatus,
  markItemsAsUnsynced,
};
