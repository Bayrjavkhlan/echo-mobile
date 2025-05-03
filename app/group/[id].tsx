import { View, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useGroupStore } from "@/store/groupStore";
import { OuterThemedView } from "@/components/OuterThemedView";

export default function GroupDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = params.id;
  const name = params.name as string;
  const { currentGroup, fetchGroupById } = useGroupStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGroup = async () => {
      setLoading(true);
      await fetchGroupById(String(id));
      setLoading(false);
    };

    loadGroup();
  }, [id, fetchGroupById]);

  console.log("currentGroup:\t", currentGroup);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
      <Stack.Screen
        options={{
          title: name || "Багцын мэдээлэл",
          headerBackTitle: "Back",
        }}
      />
      <ThemedView className="flex-1">
        <ScrollView>
          <ThemedView>
            <ThemedText>123</ThemedText>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
