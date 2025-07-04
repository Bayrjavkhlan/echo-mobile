// import { useEffect, useState, useRef } from "react";
// import NetInfo from "@react-native-community/netinfo";
// import { AppState, AppStateStatus } from "react-native";
// import * as BackgroundFetch from "expo-background-fetch";
// import * as TaskManager from "expo-task-manager";
// import {
//   performFullSync,
//   pushAllLocalChanges,
//   pullAllServerChanges,
// } from "@/api/syncManager";
// import { checkConnection } from "@/api/syncService";

// const SYNC_TASK_NAME = "BACKGROUND_SYNC_TASK";

// // Define the background task
// TaskManager.defineTask(SYNC_TASK_NAME, async () => {
//   try {
//     console.log("Running background sync task...");

//     // Check internet connection
//     const isConnected = await checkConnection();
//     if (!isConnected) {
//       console.log("No internet connection. Background sync aborted.");
//       return BackgroundFetch.BackgroundFetchResult.NoData;
//     }

//     // Use the new syncManager for sync operations
//     const result = await pushAllLocalChanges();

//     // Return success or failure based on sync result
//     return result.success
//       ? BackgroundFetch.BackgroundFetchResult.NewData
//       : BackgroundFetch.BackgroundFetchResult.Failed;
//   } catch (error) {
//     console.log("Error in background sync task:", error);
//     return BackgroundFetch.BackgroundFetchResult.Failed;
//   }
// });

// // Main hook for managing synchronization
// export const useBackgroundSync = (
//   options = {
//     // Default options
//     syncOnAppOpen: true,
//     syncOnNetworkChange: true,
//     syncInterval: 15, // minutes
//     enableBackgroundSync: true,
//     maxRetries: 3,
//   }
// ) => {
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
//   const [lastSyncResult, setLastSyncResult] = useState<any>(null);
//   const [isConnected, setIsConnected] = useState<boolean | null>(null);
//   const retryCount = useRef(0);
//   const appState = useRef(AppState.currentState);

//   // Register background sync task
//   const registerBackgroundSync = async () => {
//     if (!options.enableBackgroundSync) return;

//     try {
//       await BackgroundFetch.registerTaskAsync(SYNC_TASK_NAME, {
//         minimumInterval: options.syncInterval * 60, // convert to seconds
//         stopOnTerminate: false,
//         startOnBoot: true,
//       });
//       console.log("Background sync registered");
//     } catch (error) {
//       console.log("Background sync registration failed:", error);
//     }
//   };

//   // Perform sync with retry mechanism
//   const performSync = async (isFullSync = false) => {
//     if (isSyncing || !isConnected) return;

//     setIsSyncing(true);
//     try {
//       let result;

//       if (isFullSync) {
//         // Use the new performFullSync function from syncManager
//         result = await performFullSync();
//       } else {
//         // For background sync, just push local changes
//         result = await pushAllLocalChanges();
//       }

//       setLastSyncResult(result);
//       setLastSyncTime(new Date());
//       retryCount.current = 0;
//       return result;
//     } catch (error) {
//       console.log("Sync error:", error);
//       // Retry logic
//       if (retryCount.current < options.maxRetries) {
//         retryCount.current += 1;
//         console.log(
//           `Retrying sync (attempt ${retryCount.current}/${options.maxRetries})...`
//         );
//         // Exponential backoff for retries (2^n seconds)
//         const backoffTime = Math.min(
//           1000 * Math.pow(2, retryCount.current),
//           30000
//         ); // max 30 seconds
//         setTimeout(() => performSync(isFullSync), backoffTime);
//       } else {
//         retryCount.current = 0;
//         setLastSyncResult({ success: false, error });
//       }
//       return { success: false, error };
//     } finally {
//       setIsSyncing(false);
//     }
//   };

//   // Handle app state changes
//   const handleAppStateChange = (nextAppState: AppStateStatus) => {
//     if (
//       appState.current.match(/inactive|background/) &&
//       nextAppState === "active"
//     ) {
//       // App has come to the foreground
//       if (options.syncOnAppOpen) {
//         performSync(true); // Do a full sync when app opens
//       }
//     }
//     appState.current = nextAppState;
//   };

//   // Set up effect for network state monitoring and app state changes
//   useEffect(() => {
//     // Register background sync
//     registerBackgroundSync();

//     // Setup network state monitoring
//     const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
//       const wasConnected = isConnected;
//       const nowConnected = state.isConnected && state.isInternetReachable;

//       setIsConnected(nowConnected);

//       // Trigger sync when network connection is established
//       if (options.syncOnNetworkChange && !wasConnected && nowConnected) {
//         performSync(true);
//       }
//     });

//     // Setup app state monitoring
//     const subscription = AppState.addEventListener(
//       "change",
//       handleAppStateChange
//     );

//     // Initial sync if connected
//     NetInfo.fetch().then((state) => {
//       const connected = state.isConnected && state.isInternetReachable;
//       setIsConnected(connected);
//       if (connected) {
//         performSync(true);
//       }
//     });

//     // Cleanup subscriptions
//     return () => {
//       unsubscribeNetInfo();
//       subscription.remove();
//     };
//   }, []);

//   // Return sync state and control functions
//   return {
//     isSyncing,
//     lastSyncTime,
//     lastSyncResult,
//     isConnected,
//     sync: () => performSync(false),
//     fullSync: () => performSync(true),
//   };
// };

// export default useBackgroundSync;
