import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSync } from "@/context/SyncContext";
import { Ionicons } from "@expo/vector-icons";

type SyncIndicatorProps = {
  showLabel?: boolean;
  compact?: boolean;
  style?: any;
};

const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  showLabel = true,
  compact = false,
  style,
}) => {
  const { isSyncing, isConnected, lastSyncTime, fullSync } = useSync();

  // Format time for display
  const getFormattedTime = () => {
    if (!lastSyncTime) return "Never";

    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();

    // Less than a minute
    if (diff < 60000) {
      return "Just now";
    }

    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }

    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    // Format as date
    return lastSyncTime.toLocaleDateString();
  };

  // Get status color
  const getStatusColor = () => {
    if (!isConnected) return "#F87171"; // Red for offline
    if (isSyncing) return "#3B82F6"; // Blue for syncing
    return "#10B981"; // Green for synced
  };

  // Get status icon
  const getStatusIcon = () => {
    if (!isConnected) return "cloud-offline-outline";
    if (isSyncing) return "sync-outline";
    return "cloud-done-outline";
  };

  // Get status text
  const getStatusText = () => {
    if (!isConnected) return "Offline";
    if (isSyncing) return "Syncing...";
    return `Synced ${getFormattedTime()}`;
  };

  // Handle manual sync
  const handleSync = () => {
    if (!isSyncing && isConnected) {
      fullSync();
    }
  };

  if (compact) {
    // Compact version (just icon)
    return (
      <TouchableOpacity
        onPress={handleSync}
        style={[styles.compactContainer, style]}
      >
        {isSyncing ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <Ionicons name={getStatusIcon()} size={16} color={getStatusColor()} />
        )}
      </TouchableOpacity>
    );
  }

  // Full version
  return (
    <TouchableOpacity onPress={handleSync} style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        {isSyncing ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <Ionicons name={getStatusIcon()} size={18} color={getStatusColor()} />
        )}
      </View>
      {showLabel && <Text style={styles.statusText}>{getStatusText()}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  compactContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 6,
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
  },
});

export default SyncIndicator;
