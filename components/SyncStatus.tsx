import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useSync } from "@/context/SyncContext";
import ThemedIcon from "./ThemedIcon";

interface SyncStatusProps {
  compact?: boolean;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ compact = false }) => {
  const { theme } = useTheme();
  const {
    isSyncing,
    lastSyncTime,
    lastSyncResult,
    fullSync,
    isConnected,
    availableTables,
  } = useSync();
  const [showDetails, setShowDetails] = useState(false);

  // Format date to show both date and time
  const formatDate = (date: Date) => {
    return date.toLocaleString(undefined, {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSync = async () => {
    if (isSyncing || !isConnected) return;
    await fullSync();
  };

  // Get a simple status icon based on connection and sync state
  const getStatusIcon = () => {
    if (!isConnected) {
      return (
        <ThemedIcon name="wifi-off" size={16} color={theme.colors.error} />
      );
    }
    if (isSyncing) {
      return <ActivityIndicator size="small" color={theme.colors.primary} />;
    }
    if (lastSyncResult?.success === false) {
      return (
        <ThemedIcon name="alert-circle" size={16} color={theme.colors.error} />
      );
    }
    if (lastSyncTime) {
      return (
        <ThemedIcon
          name="check-circle"
          size={16}
          color={theme.colors.success}
        />
      );
    }
    return (
      <ThemedIcon name="help-circle" size={16} color={theme.colors.warning} />
    );
  };

  // Get a color based on sync status
  const getStatusColor = () => {
    if (!isConnected) return theme.colors.error;
    if (isSyncing) return theme.colors.primary;
    if (lastSyncResult?.success === false) return theme.colors.error;
    if (lastSyncTime) return theme.colors.success;
    return theme.colors.warning;
  };

  // Get a text message based on sync status
  const getStatusText = () => {
    if (!isConnected) return "Offline";
    if (isSyncing) return "Syncing...";
    if (lastSyncResult?.success === false) return "Sync failed";
    if (lastSyncTime) return `Last sync: ${formatDate(lastSyncTime)}`;
    return "Not synced";
  };

  // If compact mode, show minimal UI
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {getStatusIcon()}
        <Text style={[styles.compactText, { color: getStatusColor() }]}>
          {isSyncing ? "Syncing..." : lastSyncTime ? "Synced" : "Not synced"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main sync status */}
      <TouchableOpacity
        style={[styles.statusContainer, { borderColor: theme.colors.border }]}
        onPress={() => setShowDetails(!showDetails)}
        disabled={isSyncing}
      >
        <View style={styles.statusHeader}>
          <View style={styles.statusIconContainer}>
            {getStatusIcon()}
            <Text style={[styles.statusText, { color: theme.colors.text }]}>
              {getStatusText()}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.syncButton,
              {
                backgroundColor:
                  isSyncing || !isConnected
                    ? theme.colors.border
                    : theme.colors.primary,
              },
            ]}
            onPress={handleSync}
            disabled={isSyncing || !isConnected}
          >
            <ThemedIcon
              name={isSyncing ? "rotate-cw" : "refresh"}
              size={16}
              color={
                isSyncing || !isConnected
                  ? theme.colors.textSecondary
                  : theme.colors.background
              }
            />
            <Text
              style={[
                styles.syncButtonText,
                {
                  color:
                    isSyncing || !isConnected
                      ? theme.colors.textSecondary
                      : theme.colors.background,
                },
              ]}
            >
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Expanded details */}
        {showDetails && (
          <View style={styles.detailsContainer}>
            <Text
              style={[
                styles.detailsTitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Sync Status
            </Text>
            <View style={styles.detailsRow}>
              <Text
                style={[
                  styles.detailsLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Connection:
              </Text>
              <Text style={[styles.detailsValue, { color: theme.colors.text }]}>
                {isConnected ? "Online" : "Offline"}
              </Text>
            </View>

            {lastSyncTime && (
              <View style={styles.detailsRow}>
                <Text
                  style={[
                    styles.detailsLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Last Sync:
                </Text>
                <Text
                  style={[styles.detailsValue, { color: theme.colors.text }]}
                >
                  {formatDate(lastSyncTime)}
                </Text>
              </View>
            )}

            {lastSyncResult && (
              <View style={styles.detailsRow}>
                <Text
                  style={[
                    styles.detailsLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Last Result:
                </Text>
                <Text
                  style={[
                    styles.detailsValue,
                    {
                      color: lastSyncResult.success
                        ? theme.colors.success
                        : theme.colors.error,
                    },
                  ]}
                >
                  {lastSyncResult.success ? "Success" : "Failed"}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  statusContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  syncButtonText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailsLabel: {
    width: 100,
    fontSize: 14,
  },
  detailsValue: {
    fontSize: 14,
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default SyncStatus;
