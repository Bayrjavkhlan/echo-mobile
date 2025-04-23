import { Pressable, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import Label from "./Label";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

interface GroupFlashcardProps {
  groupFlashcard: {
    id: string;
    title: string;
    count: number;
    labels: {
      text: string;
      color: string;
      icon?: keyof typeof MaterialIcons.glyphMap;
    }[];
    description: string;
  };
}

const GroupFlashcard = ({ groupFlashcard }: GroupFlashcardProps) => {
  const router = useRouter();

  const handlePress = () => {
    console.log("Navigating to group ID:", groupFlashcard.id);

    router.push({
      pathname: "/group/[id]",
      params: { id: groupFlashcard.id, name: groupFlashcard.title },
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <ThemedView
        className="flex flex-col p-4 rounded-lg shadow-md gap-2"
        lightColor={Colors.light.contentBackground}
        darkColor={Colors.dark.contentBackground}
      >
        <ThemedView className="flex flex-row items-center justify-between">
          <ThemedText className="text-lg font-bold">
            {groupFlashcard.title}
          </ThemedText>
          <ThemedText className="text-base text-gray-500">
            {groupFlashcard.count}
          </ThemedText>
        </ThemedView>

        <ThemedView className="flex flex-row items-center gap-2 flex-wrap">
          {groupFlashcard.labels.map((label, index) => (
            <Label key={index} data={label} className="mr-1 mb-1" />
          ))}
        </ThemedView>

        <ThemedText className="text-gray-600 dark:text-gray-300">
          {groupFlashcard.description}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
};

export default GroupFlashcard;
