import { Pressable, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import Label from "./Label";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { FlashcardGroup, LabelType } from "@/store/groupStore";

interface GroupFlashcardProps {
  groupFlashcard: FlashcardGroup;
  count: number;
}

const GroupFlashcard = ({ groupFlashcard, count }: GroupFlashcardProps) => {
  const router = useRouter();

  // For debugging
  console.log(`GroupFlashcard (${groupFlashcard.id}):`, {
    title: groupFlashcard.title,
    count: count,
    labels: groupFlashcard.labels,
    flashcardsCount: groupFlashcard.flashcards.length,
    flashcardLabels: groupFlashcard.flashcards.map((fc) => ({
      flashcardId: fc.id,
      labels: fc.labels?.map((l) => `${l.id}: ${l.text}`) || [],
    })),
  });

  const handlePress = () => {
    console.log("Navigating to group ID:", groupFlashcard.id);

    router.push({
      pathname: "/group/[id]",
      params: { id: groupFlashcard.id, name: groupFlashcard.title },
    });
  };

  // Function to deduplicate labels - in case we have duplicates
  const deduplicateLabels = (labels: LabelType[]): LabelType[] => {
    const uniqueLabels = new Map<string, LabelType>();

    if (!labels || !Array.isArray(labels)) {
      console.warn("No valid labels array provided to deduplicateLabels");
      return [];
    }

    labels.forEach((label) => {
      if (!label || !label.id) {
        console.warn("Invalid label found:", label);
        return;
      }

      // Ensure consistent string ID
      const id = String(label.id);

      if (!uniqueLabels.has(id)) {
        uniqueLabels.set(id, {
          id,
          text: label.text,
        });
      }
    });

    return Array.from(uniqueLabels.values());
  };

  // Collect all unique labels across all flashcards in this group
  const collectAllLabelsFromFlashcards = (): LabelType[] => {
    const allLabelsMap = new Map<string, LabelType>();

    groupFlashcard.flashcards.forEach((fc) => {
      if (fc.labels && Array.isArray(fc.labels)) {
        fc.labels.forEach((label) => {
          if (label && label.id) {
            const id = String(label.id);
            const text = label.text || "Unknown";

            allLabelsMap.set(id, { id, text });
          }
        });
      }
    });

    return Array.from(allLabelsMap.values());
  };

  // Get and deduplicate all labels
  const allGroupLabels = collectAllLabelsFromFlashcards();
  const uniqueLabels = deduplicateLabels(
    groupFlashcard.labels.length > 0 ? groupFlashcard.labels : allGroupLabels
  );

  console.log(
    `GroupFlashcard (${groupFlashcard.id}) - Final labels:`,
    uniqueLabels.map((l) => `${l.id}: ${l.text}`)
  );

  return (
    <Pressable onPress={handlePress}>
      <ThemedView
        className="flex flex-col p-4 rounded-lg shadow-md gap-2"
        lightColor={Colors.light.contentBackground}
        darkColor={Colors.dark.contentBackground}
      >
        <ThemedView className="flex flex-row items-center justify-between">
          <ThemedView className="flex-row flex-1">
            <ThemedText className="text-lg font-bold pr-1" numberOfLines={1}>
              {groupFlashcard.title}
            </ThemedText>
          </ThemedView>
          <ThemedText className="text-base text-gray-500 ml-2">
            {count} cards
          </ThemedText>
        </ThemedView>

        <ThemedView className="flex flex-row items-center gap-2 flex-wrap">
          {uniqueLabels && uniqueLabels.length > 0 ? (
            <>
              {uniqueLabels.slice(0, 5).map((label, index) => (
                <Label
                  key={`${label.id}-${index}`}
                  data={{
                    id: label.id,
                    text: label.text,
                  }}
                  className="mr-1 mb-1"
                  selectable={false}
                />
              ))}
              {uniqueLabels.length > 5 && (
                <ThemedText className="text-xs text-gray-500">
                  +{uniqueLabels.length - 5} more
                </ThemedText>
              )}
            </>
          ) : (
            <ThemedText className="text-xs text-gray-500">No labels</ThemedText>
          )}
        </ThemedView>

        {groupFlashcard.description && (
          <ThemedText
            className="text-gray-600 dark:text-gray-300"
            numberOfLines={2}
          >
            {groupFlashcard.description}
          </ThemedText>
        )}
      </ThemedView>
    </Pressable>
  );
};

export default GroupFlashcard;
