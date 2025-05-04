import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable, View } from "react-native";
import GroupFlashcard from "@/components/ui/GroupFlashcard";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HorizontalLabelScroll from "@/components/HorizontalLabelScroll";
import { useGroupStore } from "@/store/groupStore";
import { useRouter } from "expo-router";
import { useLabelStore } from "@/store/labelStore";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function LibraryScreen() {
  const { groups, fetchGroups } = useGroupStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const labels = useLabelStore((state) => state.labels);
  const fetchLabels = useLabelStore((state) => state.fetchLabels);

  useEffect(() => {
    fetchGroups();
    fetchLabels();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (groups.length === 0) {
        fetchGroups();
      }
      if (labels.length === 0) {
        fetchLabels();
      }
    }, [])
  );

  console.log("LibraryScreen groups", groups);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        {labels.length > 0 && (
          <ThemedView className="p-4 pb-0">
            <HorizontalLabelScroll />
          </ThemedView>
        )}
        <ThemedView>
          {groups.length === 0 ? (
            <ThemedView className="flex items-center justify-center h-full gap-2">
              <ThemedText className="text-base text-gray-500">
                Хадгалсан флашкарт багц хоосон байна
              </ThemedText>
              <Pressable
                onPress={() => router.push({ pathname: "/(tabs)/Add" })}
              >
                <ThemedText>Флашкарт багц үүсгэх</ThemedText>
              </Pressable>
            </ThemedView>
          ) : (
            <FlatList
              data={groups}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <GroupFlashcard groupFlashcard={item} count={item.cardCount} />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              contentContainerStyle={{
                paddingBottom: insets.bottom + 220,
              }}
              className="px-4 pt-4 pb-2"
              style={{ padding: 16 }}
            />
          )}
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}
