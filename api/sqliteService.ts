import useDatabase from "@/hooks/useDatabase";
import * as SQLite from "expo-sqlite";

// Create a database connection
const db = useDatabase();

/**
 * SQLite service for direct database operations
 * This is used for operations that are difficult to express using Drizzle ORM
 */
export const SQLiteService = {
  /**
   * Execute an SQL query with parameters
   */
  executeQuery: (sql: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            console.error("SQL Error:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  },

  /**
   * Update isSync flag for items in a table
   */
  markItemsAsSynced: async (tableName: string, items: any[]): Promise<void> => {
    if (!items || items.length === 0) return;

    try {
      if (tableName === "flashcardLabels") {
        // For flashcardLabels table (composite key)
        for (const item of items) {
          if (item.flashcardId && item.labelId) {
            await SQLiteService.executeQuery(
              `UPDATE flashcard_labels 
               SET isSync = 1 
               WHERE flashcard_id = ? AND label_id = ?`,
              [item.flashcardId, item.labelId]
            );
          }
        }
      } else {
        // For tables with id column
        const ids = items.filter((item) => item.id).map((item) => item.id);

        if (ids.length > 0) {
          const placeholders = ids.map(() => "?").join(",");
          const dbTableName = convertTableNameForDb(tableName);

          await SQLiteService.executeQuery(
            `UPDATE ${dbTableName} SET isSync = 1 WHERE id IN (${placeholders})`,
            ids
          );
        }
      }
    } catch (error) {
      console.error(`Error marking items as synced for ${tableName}:`, error);
      throw error;
    }
  },

  /**
   * Insert or update an item from the server
   */
  upsertServerItem: async (
    tableName: string,
    serverItem: any
  ): Promise<void> => {
    try {
      const dbTableName = convertTableNameForDb(tableName);
      const localItem = convertServerItemToLocalFormat(serverItem, tableName);

      if (tableName === "flashcardLabels") {
        // Handle flashcardLabels specially (composite key)
        if (localItem.flashcardId && localItem.labelId) {
          // Check if it exists
          const result = await SQLiteService.executeQuery(
            `SELECT * FROM flashcard_labels 
             WHERE flashcard_id = ? AND label_id = ?`,
            [localItem.flashcardId, localItem.labelId]
          );

          if (result.rows.length > 0) {
            // Update existing
            await SQLiteService.executeQuery(
              `UPDATE flashcard_labels 
               SET isSync = 1, updatedBy = 'server-sync'
               WHERE flashcard_id = ? AND label_id = ?`,
              [localItem.flashcardId, localItem.labelId]
            );
          } else {
            // Insert new
            await SQLiteService.executeQuery(
              `INSERT INTO flashcard_labels (flashcard_id, label_id, isSync, updatedBy)
               VALUES (?, ?, 1, 'server-sync')`,
              [localItem.flashcardId, localItem.labelId]
            );
          }
        }
      } else {
        // For tables with id
        if (localItem.id) {
          // Check if it exists
          const result = await SQLiteService.executeQuery(
            `SELECT * FROM ${dbTableName} WHERE id = ?`,
            [localItem.id]
          );

          if (result.rows.length > 0) {
            // Build update query dynamically
            const updates = [];
            const values = [];

            for (const [key, value] of Object.entries(localItem)) {
              if (key !== "id") {
                updates.push(`${convertCamelToSnake(key)} = ?`);
                values.push(value);
              }
            }

            if (updates.length > 0) {
              // Add isSync and updatedBy
              updates.push(`isSync = 1`);
              updates.push(`updatedBy = 'server-sync'`);

              // Add id at the end for WHERE clause
              values.push(localItem.id);

              await SQLiteService.executeQuery(
                `UPDATE ${dbTableName} SET ${updates.join(", ")} WHERE id = ?`,
                values
              );
            }
          } else {
            // Build insert query dynamically
            const columns = [];
            const placeholders = [];
            const values = [];

            for (const [key, value] of Object.entries(localItem)) {
              columns.push(convertCamelToSnake(key));
              placeholders.push("?");
              values.push(value);
            }

            // Add isSync and updatedBy
            columns.push("isSync");
            columns.push("updatedBy");
            placeholders.push("1");
            placeholders.push("?");
            values.push("server-sync");

            await SQLiteService.executeQuery(
              `INSERT INTO ${dbTableName} (${columns.join(", ")}) 
               VALUES (${placeholders.join(", ")})`,
              values
            );
          }
        }
      }
    } catch (error) {
      console.error(`Error upserting server item for ${tableName}:`, error);
      throw error;
    }
  },
};

// Helper to convert camelCase to snake_case
const convertCamelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// Convert frontend table name to database table name
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

// Helper function to convert server item format to local format
const convertServerItemToLocalFormat = (
  serverItem: any,
  tableName: string
): any => {
  const result: any = { ...serverItem };

  // Convert field names as needed
  if (serverItem.group_id) {
    result.groupId = serverItem.group_id;
    delete result.group_id;
  }

  if (serverItem.user_id) {
    result.userId = serverItem.user_id;
    delete result.user_id;
  }

  if (serverItem.flashcard_id) {
    result.flashcardId = serverItem.flashcard_id;
    delete result.flashcard_id;
  }

  if (serverItem.label_id) {
    result.labelId = serverItem.label_id;
    delete result.label_id;
  }

  // Handle date fields
  if (serverItem.created_at) {
    result.createdAt = new Date(serverItem.created_at).getTime();
    delete result.created_at;
  }

  if (serverItem.updated_at) {
    result.updatedAt = new Date(serverItem.updated_at).getTime();
    delete result.updated_at;
  }

  // Use mobile_id as id if available
  if (serverItem.mobile_id) {
    result.id = serverItem.mobile_id;
  }

  // Remove fields that shouldn't be stored locally
  delete result.last_synced_at;

  return result;
};

export default SQLiteService;
