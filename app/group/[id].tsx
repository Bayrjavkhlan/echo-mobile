import { View, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect } from "react";
import { Colors } from "@/constants/Colors";

export default function GroupDetailsScreen() {
  // Get the ID from the URL params
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = params.id;
  const name = params.name as string;

  useEffect(() => {
    console.log("Standard file - Group ID from params:", id);
    console.log("All params:", JSON.stringify(params));
  }, [id, params]);

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: name || "Group Details",
          headerBackTitle: "Back",
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ThemedView
          className="mb-6 p-5 rounded-xl"
          lightColor={Colors.light.contentBackground}
          darkColor={Colors.dark.contentBackground}
        >
          <ThemedText className="text-2xl font-bold">
            {name || "Group Details"}
          </ThemedText>
          <ThemedView className="flex-row mt-3">
            <MaterialIcons name="tag" size={20} color="#666" />
            <ThemedText className="ml-2 text-base">ID: {id}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView
          className="p-4 mb-4 rounded-lg"
          lightColor={Colors.light.tint + "20"}
          darkColor={Colors.dark.tint + "20"}
        >
          <ThemedText className="text-lg font-bold mb-2">
            Debug Info:
          </ThemedText>
          <ThemedText className="mt-2 text-sm">All Parameters:</ThemedText>
          <ThemedView className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
            <ThemedText className="text-xs">
              {JSON.stringify(params, null, 2)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
