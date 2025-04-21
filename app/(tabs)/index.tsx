import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFlashcards } from "@/app/hook/useFlashcards";
import { ProgressBar } from "@/components/ProgressBar";

const labels = [
  { id: 1, name: "Home", icon: "home" },
  { id: 2, name: "Profile", icon: "user" },
  { id: 3, name: "Settings", icon: "settings" },
  { id: 4, name: "Messages", icon: "message-circle" },
  { id: 5, name: "Notifications", icon: "bell" },
  { id: 6, name: "Favorites", icon: "heart" },
  { id: 7, name: "Search", icon: "search" },
  { id: 8, name: "Camera", icon: "camera" },
  { id: 9, name: "Music", icon: "music" },
  { id: 10, name: "Weather", icon: "cloud" },
];

const labelData = {
  text: "Боловсрол",
  color: "blue",
};

export default function HomeScreen() {
  const {
    flashcards,
    loading,
    error,
    fetchFlashcards,
    isConnected,
    syncWithServer,
    isSyncing,
  } = useFlashcards();

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  if (loading) {
    return (
      <SafeAreaView className="bg-white dark:bg-gray-900 flex-1">
        <ThemedText>Loading flashcards...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white dark:bg-gray-900 flex-1">
      {/* Connectivity status indicator */}
      <ThemedView className="flex-row justify-between px-4 py-2 items-center">
        <ThemedView className="flex-row items-center gap-2">
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: isConnected ? "#4CAF50" : "#F44336" }}
          />
          <ThemedText className="text-sm">
            {isConnected ? "Online" : "Offline"}
          </ThemedText>
        </ThemedView>

        {/* Sync button */}
        <TouchableOpacity
          onPress={syncWithServer}
          disabled={!isConnected || isSyncing}
          className={`px-4 py-2 rounded-md ${!isConnected ? "opacity-50" : ""}`}
          style={{ backgroundColor: "#3085FE" }}
        >
          <Text className="text-white text-sm">
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Text>
        </TouchableOpacity>
      </ThemedView>

      {/* Error display */}
      {error && (
        <ThemedView className="bg-red-100 dark:bg-red-900 p-2 m-2 rounded">
          <ThemedText className="text-red-800 dark:text-red-200">
            Error: {error}
          </ThemedText>
        </ThemedView>
      )}

      <ProgressBar totalWords={123} memorizedWords={12} />
    </SafeAreaView>
  );
}
