import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import { ThemedText } from "../ThemedText";
import tw from "twrnc";

type LabelType = {
  text: string;
  color: string;
  icon?: string;
};

export default function Label({ data }: { data: LabelType }) {
  const { text, color, icon } = data;
  return (
    <View
      style={tw`bg-${color} py-1 px-3 border border-${color} rounded-lg w-auto self-start`}
    >
      {/* <MaterialIcons color={color} name={"quiz"} size={20} /> */}
      <ThemedText className="text-sm font-bold text-gray-800 dark:text-gray-200">
        {text}
      </ThemedText>
    </View>
  );
}
