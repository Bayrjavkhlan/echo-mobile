import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useGroupStore } from "@/store/groupStore";
import FlashcardTrain from "@/components/FlashcardTrain";

export default function GroupTrainScreen() {
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
          title: `Давтах: ${name}  ` || "Багцын мэдээлэл",
          headerBackTitle: "Back",
        }}
      />
      <ThemedView className="flex-1 p-4">
        {loading ? (
          <ThemedView className="flex-1 items-center justify-center">
            <ThemedText className="text-lg">Loading flashcards...</ThemedText>
          </ThemedView>
        ) : (
          <FlashcardTrain rawGroup={currentGroup} />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
