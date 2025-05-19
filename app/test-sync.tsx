import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { syncAllUnsynced, fullSync, checkConnection } from "@/api/syncService";
import { useSync } from "@/context/SyncContext";
import syncUtils from "@/api/syncUtils";
import { SYNC_TABLES } from "@/api/syncManager";

export default function TestSyncScreen() {
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { sync, fullSync: contextSync, isSyncing } = useSync();

  const addLog = (message: string) => {
    setTestLogs((prev) => [
      ...prev,
      `${new Date().toISOString().substr(11, 8)}: ${message}`,
    ]);
  };

  const runTest = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setTestLogs([]);

    try {
      // 1. Check connection
      addLog("Checking internet connection...");
      const isConnected = await checkConnection();
      addLog(`Connection status: ${isConnected ? "Online" : "Offline"}`);

      if (!isConnected) {
        addLog("No internet connection. Test aborted.");
        setIsRunning(false);
        return;
      }

      // 2. Get current sync status
      addLog("Getting current sync status...");
      const status = await syncUtils.getSyncStatus();
      addLog("Current sync status:");

      for (const table of SYNC_TABLES) {
        const tableStatus = status[table];
        if (tableStatus && "unsyncedCount" in tableStatus) {
          addLog(`- ${table}: ${tableStatus.unsyncedCount} unsynced items`);
        } else {
          addLog(
            `- ${table}: Error - ${tableStatus?.error || "Unknown error"}`
          );
        }
      }

      // 3. Mark some items as unsynced for testing
      addLog("Marking some items as unsynced for testing...");
      for (const table of ["flashcards", "groups", "labels", "wrongAnswers"]) {
        try {
          const result = await syncUtils.markItemsAsUnsynced(table, 2);
          addLog(
            `- ${table}: ${result.success ? result.message : result.error}`
          );
        } catch (error) {
          addLog(`- ${table}: Error - ${error.message}`);
        }
      }

      // 4. Run sync via context
      addLog("Running sync via SyncContext...");
      const contextResult = await contextSync();
      addLog(
        `SyncContext result: ${contextResult.success ? "Success" : "Failed"}`
      );

      // 5. Check sync status again
      addLog("Checking sync status after sync...");
      const finalStatus = await syncUtils.getSyncStatus();
      addLog("Final sync status:");

      for (const table of SYNC_TABLES) {
        const tableStatus = finalStatus[table];
        if (tableStatus && "unsyncedCount" in tableStatus) {
          addLog(`- ${table}: ${tableStatus.unsyncedCount} unsynced items`);
        } else {
          addLog(
            `- ${table}: Error - ${tableStatus?.error || "Unknown error"}`
          );
        }
      }

      addLog("Test completed successfully!");
    } catch (error) {
      addLog(`Error during test: ${error.message}`);
      console.error("Test error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sync Test Screen</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={isRunning || isSyncing ? "Running..." : "Run Sync Tests"}
          onPress={runTest}
          disabled={isRunning || isSyncing}
        />
      </View>

      {(isRunning || isSyncing) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Running sync tests...</Text>
        </View>
      )}

      <ScrollView style={styles.logContainer}>
        <Text style={styles.logTitle}>Test Logs:</Text>
        {testLogs.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {log}
          </Text>
        ))}
        {testLogs.length === 0 && (
          <Text style={styles.emptyText}>
            No logs yet. Run the test to see results.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#e6f7ff",
    borderRadius: 8,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 16,
  },
  logContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  logTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  logText: {
    fontSize: 12,
    fontFamily: "monospace",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
});
