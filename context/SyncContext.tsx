// import React, { createContext, useContext, ReactNode } from "react";
// import useBackgroundSync from "@/hooks/useBackgroundSync";
// import {
//   pushChangesForTable,
//   pullServerChangesForTable,
//   SYNC_TABLES,
// } from "@/api/syncManager";

// // Define the type for our sync context
// type SyncContextType = {
//   isSyncing: boolean;
//   lastSyncTime: Date | null;
//   lastSyncResult: any;
//   isConnected: boolean | null;
//   sync: () => Promise<any>;
//   fullSync: () => Promise<any>;
//   syncTable: (tableName: string) => Promise<any>;
//   pullTable: (tableName: string) => Promise<any>;
//   availableTables: string[];
// };

// // Create the context with a default value
// const SyncContext = createContext<SyncContextType | undefined>(undefined);

// // Provider component
// export const SyncProvider: React.FC<{
//   children: ReactNode;
//   options?: {
//     syncOnAppOpen?: boolean;
//     syncOnNetworkChange?: boolean;
//     syncInterval?: number;
//     enableBackgroundSync?: boolean;
//     maxRetries?: number;
//   };
// }> = ({ children, options }) => {
//   // Use our custom hook to manage the sync functionality
//   const syncState = useBackgroundSync(options);

//   // Add additional methods for table-specific sync operations
//   const enhancedSyncState = {
//     ...syncState,
//     syncTable: async (tableName: string) => {
//       if (!SYNC_TABLES.includes(tableName)) {
//         return {
//           success: false,
//           message: `Invalid table name: ${tableName}`,
//         };
//       }
//       return pushChangesForTable(tableName);
//     },
//     pullTable: async (tableName: string) => {
//       if (!SYNC_TABLES.includes(tableName)) {
//         return {
//           success: false,
//           message: `Invalid table name: ${tableName}`,
//         };
//       }
//       return pullServerChangesForTable(tableName);
//     },
//     availableTables: SYNC_TABLES,
//   };

//   return (
//     <SyncContext.Provider value={enhancedSyncState}>
//       {children}
//     </SyncContext.Provider>
//   );
// };

// // Custom hook to use the sync context
// export const useSync = (): SyncContextType => {
//   const context = useContext(SyncContext);
//   if (context === undefined) {
//     throw new Error("useSync must be used within a SyncProvider");
//   }
//   return context;
// };

// export default SyncContext;
