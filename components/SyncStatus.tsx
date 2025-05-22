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
import { useColor } from "@/hooks/useThemeColor";

interface SyncStatusProps {
  compact?: boolean;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ compact = false }) => {
  const { theme } = useTheme();
  const { isSyncing, lastSyncTime, lastSyncResult, fullSync, isConnected } =
    useSync();
  const [showDetails, setShowDetails] = useState(false);
  const blueColor = useColor("blue");
  const redColor = useColor("red");
  const greenColor = useColor("green");
  const iconColor = useColor("text");
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

  const getStatusIcon = () => {
    if (!isConnected) {
      return <ThemedIcon name="cloud-off" size={16} color={redColor} />;
    }
    if (isSyncing) {
      return <ActivityIndicator size="small" color={blueColor} />;
    }
    if (lastSyncResult?.success === false) {
      return <ThemedIcon name="alert-circle" size={16} color={redColor} />;
    }
    if (lastSyncTime) {
      return <ThemedIcon name="cloud-done" size={16} color={greenColor} />;
    }
    return <ThemedIcon name="backup" size={16} color={iconColor} />;
  };

  // Get a color based on sync status
  const getStatusColor = () => {
    if (!isConnected) return redColor;
    if (isSyncing) return blueColor;
    if (lastSyncResult?.success === false) return redColor;
    if (lastSyncTime) return greenColor;
    return theme.colors.warning;
  };

  // Get a text message based on sync status
  const getStatusText = () => {
    if (!isConnected) return "Оффлайн";
    if (isSyncing) return "Хадгалж байна байна...";
    if (lastSyncResult?.success === false) return "Амжилтгүй";
    if (lastSyncTime) return `Сүүлд хадгалсан: ${formatDate(lastSyncTime)}`;
    return "Серверт датагаа хадгалах";
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <ThemedIcon name="backup" size={16} color={iconColor} />
        <Text style={[styles.compactText, { color: getStatusColor() }]}>
          {isSyncing
            ? "Хадгалаж байна..."
            : lastSyncTime
            ? "Хадгалагдсан"
            : "Хадгалах"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main sync status */}
      <TouchableOpacity
        style={[styles.statusContainer, { borderColor: blueColor }]}
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
          {!isSyncing ? (
            <TouchableOpacity
              style={[
                styles.syncButton,
                {
                  backgroundColor:
                    isSyncing || !isConnected ? blueColor : blueColor,
                },
              ]}
              onPress={handleSync}
              disabled={isSyncing || !isConnected}
            >
              <>
                <ThemedIcon
                  name={"refresh"}
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
                  Хадгалах
                </Text>
              </>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  statusContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 8,
  },
  statusIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 600,
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
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactText: {
    fontSize: 18,
    marginLeft: 4,
  },
});

export default SyncStatus;
