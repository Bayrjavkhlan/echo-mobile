import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import { ThemedText } from "../ThemedText";

type LabelType = {
  text: string;
  color: string;
  icon?: string;
};

export default function Label({ data }: { data: LabelType }) {
  const { text, color, icon } = data;
  return (
    <View>
      <MaterialIcons color={color} name={"quiz"} size={20} />
      <ThemedText className="text-sm font-bold text-gray-800 dark:text-gray-200">
        {text}
      </ThemedText>
    </View>
  );
}
