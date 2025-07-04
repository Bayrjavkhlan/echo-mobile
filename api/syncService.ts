// import axios from "axios";
// import NetInfo from "@react-native-community/netinfo";
// import useDatabase from "@/hooks/useDatabase";
// import { getAllFlashcardTableData } from "@/db/crud/flashcards";
// import { getAllGroupTableData } from "@/db/crud/group";
// import { getAllLabelTableData } from "@/db/crud/labels";
// import { getAllFlashcardLabelsTableData } from "@/db/crud/flashcardLabels";
// import { getAllReviewTableData } from "@/db/crud/reviews";
// import { getAllWrongAnswerTableData } from "@/db/crud/wrongAnswers";
// import { getAllCalendarTableData } from "@/db/crud/calendar";
// import config from "@/config";
// import SQLiteService from "./sqliteService";

// // Configure the API base URL
// const API_BASE_URL = config.SERVER_URL;

// const db = useDatabase();

// // Define types for sync operations
// type TableData = {
//   id?: number;
//   isSync?: number | null;
//   flashcardId?: number;
//   labelId?: number;
//   [key: string]: any;
// };

// // Define the type for server items received during sync
// type ServerItem = {
//   id?: number;
//   mobile_id?: number;
//   [key: string]: any;
// };

// // Check if the device is connected to the internet
// export const checkConnection = async (): Promise<boolean> => {
//   const netInfo = await NetInfo.fetch();
//   return netInfo.isConnected && netInfo.isInternetReachable ? true : false;
// };

// // Function to get all unsynced items from a specific table
// export const getUnsyncedItems = async (
//   tableName: string
// ): Promise<TableData[]> => {
//   try {
//     // Different tables have different structures, so we need to handle each one separately
//     switch (tableName) {
//       case "flashcards":
//         const flashcards = await getAllFlashcardTableData();
//         return flashcards?.filter((item: TableData) => item.isSync === 0) || [];
//       case "groups":
//         const groups = await getAllGroupTableData();
//         return groups?.filter((item: TableData) => item.isSync === 0) || [];
//       case "labels":
//         const labels = await getAllLabelTableData();
//         return labels?.filter((item: TableData) => item.isSync === 0) || [];
//       case "flashcardLabels":
//         const flashcardLabels = await getAllFlashcardLabelsTableData();
//         return (
//           flashcardLabels?.filter((item: TableData) => item.isSync === 0) || []
//         );
//       case "reviews":
//         const reviews = await getAllReviewTableData();
//         return reviews?.filter((item: TableData) => item.isSync === 0) || [];
//       case "wrongAnswers":
//         const wrongAnswers = await getAllWrongAnswerTableData();
//         return (
//           wrongAnswers?.filter((item: TableData) => item.isSync === 0) || []
//         );
//       case "calendar":
//         const calendar = await getAllCalendarTableData();
//         return calendar?.filter((item: TableData) => item.isSync === 0) || [];
//       default:
//         console.warn(`Unknown table: ${tableName}`);
//         return [];
//     }
//   } catch (error) {
//     console.log(`Error getting unsynced ${tableName}:`, error);
//     return [];
//   }
// };

// // Generic function to sync all unsynced items for a specific table
// export const syncUnsyncedForTable = async (tableName: string) => {
//   try {
//     // Check internet connection first
//     const isConnected = await checkConnection();
//     if (!isConnected) {
//       console.log("No internet connection available. Sync aborted.");
//       return { success: false, message: "No internet connection available" };
//     }

//     // Get all unsynced items for this table
//     const items = await getUnsyncedItems(tableName);

//     console.log(`Found ${items.length} unsynced ${tableName} to sync.`);

//     // If there are no unsynced items, return
//     if (items.length === 0) {
//       return { success: true, message: `No ${tableName} to sync` };
//     }

//     try {
//       // Convert tableName to the format expected by the backend
//       const backendTableName = convertTableNameForBackend(tableName);

//       // Send all items at once to the sync endpoint
//       const response = await axios.post(
//         `${API_BASE_URL}/sync/${backendTableName}`,
//         items
//       );

//       if (response.data && response.data.success) {
//         // Use SQLiteService to mark items as synced
//         await SQLiteService.markItemsAsSynced(tableName, items);

//         console.log(
//           `Successfully synced ${
//             response.data.created + response.data.updated
//           } ${tableName} items`
//         );

//         return {
//           success: true,
//           message: `Synced ${
//             response.data.created + response.data.updated
//           } ${tableName} items`,
//           results: response.data,
//         };
//       } else {
//         console.log(`Sync response error:`, response.data);
//         return {
//           success: false,
//           message: `Failed to sync ${tableName}: ${
//             response.data?.message || "Unknown error"
//           }`,
//           error: response.data,
//         };
//       }
//     } catch (error) {
//       // console.log(`Error syncing ${tableName}:`, error);
//       return {
//         success: false,
//         message: `Sync failed for ${tableName} due to an error`,
//         error,
//       };
//     }
//   } catch (error) {
//     console.log(`Error in syncUnsynced for ${tableName}:`, error);
//     return {
//       success: false,
//       message: `Sync failed for ${tableName} due to an error`,
//       error,
//     };
//   }
// };

// // Pull changes from server for a specific table
// export const pullChangesForTable = async (tableName: string) => {
//   try {
//     // Check internet connection first
//     const isConnected = await checkConnection();
//     if (!isConnected) {
//       console.log("No internet connection available. Pull aborted.");
//       return { success: false, message: "No internet connection available" };
//     }

//     // Convert tableName to the format expected by the backend
//     const backendTableName = convertTableNameForBackend(tableName);

//     // Get all items for this table from the server using the proper sync endpoint
//     const response = await axios.get(
//       `${API_BASE_URL}/sync/changes/${backendTableName}`
//     );

//     if (!response.data || !response.data.success) {
//       throw new Error(
//         `Failed to pull changes for ${tableName}: ${
//           response.data?.message || "Unknown error"
//         }`
//       );
//     }

//     const serverItems = response.data.changes || [];
//     console.log(`Received ${serverItems.length} ${tableName} from server`);

//     // Process each server item
//     let addedCount = 0;
//     let updatedCount = 0;

//     for (const serverItem of serverItems as ServerItem[]) {
//       try {
//         // Use SQLiteService to upsert each item
//         await SQLiteService.upsertServerItem(tableName, serverItem);

//         // Determine if it was added or updated
//         if (serverItem.mobile_id) {
//           updatedCount++;
//         } else {
//           addedCount++;
//         }
//       } catch (error) {
//         console.log(`Error processing server item for ${tableName}:`, error);
//       }
//     }

//     return {
//       success: true,
//       message: `Processed ${serverItems.length} ${tableName} from server (Added: ${addedCount}, Updated: ${updatedCount})`,
//       added: addedCount,
//       updated: updatedCount,
//     };
//   } catch (error) {
//     console.log(`Error pulling changes for ${tableName}:`, error);
//     return {
//       success: false,
//       message: `Pull failed for ${tableName} due to an error`,
//       error,
//     };
//   }
// };

// // Convert frontend table name to backend format
// const convertTableNameForBackend = (tableName: string): string => {
//   switch (tableName) {
//     case "flashcards":
//       return "flashcards";
//     case "groups":
//       return "groups";
//     case "labels":
//       return "labels";
//     case "flashcardLabels":
//       return "flashcard_labels";
//     case "reviews":
//       return "reviews";
//     case "wrongAnswers":
//       return "wrong_answers";
//     case "calendar":
//       return "calendar";
//     default:
//       return tableName;
//   }
// };

// // Sync all unsynced items across all tables
// export const syncAllUnsynced = async () => {
//   try {
//     // Check internet connection first
//     const isConnected = await checkConnection();
//     if (!isConnected) {
//       console.log("No internet connection available. Sync aborted.");
//       return { success: false, message: "No internet connection available" };
//     }

//     // Sync tables in the correct order (to handle dependencies)
//     // Order matters: sync parent tables before child tables with foreign keys
//     const tableOrder = [
//       "groups",
//       "labels",
//       "flashcards",
//       "flashcardLabels",
//       "reviews",
//       "wrongAnswers",
//       "calendar",
//     ];

//     const results: Record<string, any> = {};
//     let allSuccess = true;

//     for (const tableName of tableOrder) {
//       const result = await syncUnsyncedForTable(tableName);
//       results[tableName] = result;
//       if (!result.success) {
//         allSuccess = false;
//       }
//     }

//     return {
//       success: allSuccess,
//       message: "Sync completed for all tables",
//       results,
//     };
//   } catch (error) {
//     console.log("Error in syncAllUnsynced:", error);
//     return { success: false, message: "Sync failed due to an error", error };
//   }
// };

// // Background sync function to be called periodically
// export const backgroundSync = async () => {
//   try {
//     console.log("Starting background sync...");
//     const result = await syncAllUnsynced();
//     console.log("Background sync result:", result);
//     return result;
//   } catch (error) {
//     console.log("Background sync error:", error);
//     return { success: false, message: "Background sync failed", error };
//   }
// };

// // Pull all changes from server across all tables
// export const pullAllChanges = async () => {
//   try {
//     // Check internet connection first
//     const isConnected = await checkConnection();
//     if (!isConnected) {
//       console.log("No internet connection available. Pull aborted.");
//       return { success: false, message: "No internet connection available" };
//     }

//     // Pull changes for each table in correct order
//     const tableOrder = [
//       "groups",
//       "labels",
//       "flashcards",
//       "flashcardLabels",
//       "reviews",
//       "wrongAnswers",
//       "calendar",
//     ];

//     const results: Record<string, any> = {};
//     let allSuccess = true;

//     for (const tableName of tableOrder) {
//       const result = await pullChangesForTable(tableName);
//       results[tableName] = result;
//       if (!result.success) {
//         allSuccess = false;
//       }
//     }

//     return {
//       success: allSuccess,
//       message: "Pull completed for all tables",
//       results,
//     };
//   } catch (error) {
//     console.log("Error in pullAllChanges:", error);
//     return { success: false, message: "Pull failed due to an error", error };
//   }
// };

// // Full sync operation (push local changes and pull server changes)
// export const fullSync = async () => {
//   try {
//     // First push local changes to server
//     const pushResult = await syncAllUnsynced();

//     // Then pull changes from server
//     const pullResult = await pullAllChanges();

//     return {
//       success: pushResult.success && pullResult.success,
//       push: pushResult,
//       pull: pullResult,
//     };
//   } catch (error) {
//     console.log("Error in full sync:", error);
//     return { success: false, message: "Full sync failed", error };
//   }
// };
