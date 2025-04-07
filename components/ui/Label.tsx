import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import tw from "twrnc";

export type LabelType = {
  text: string;
  color: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export default function Label({
  data,
  className,
}: {
  data: LabelType;
  className?: string;
}) {
  const { text, color, icon } = data;

  return (
    <View
      style={[
        tw`py-1 px-3 rounded-xl w-auto self-start flex flex-row items-center justify-center`,
        tw`bg-${color}-400 border border-${color}-700`,
        className ? tw.style(className) : null,
      ]}
    >
      <ThemedText type="defaultSemiBold" className="text-sm">
        {text}
      </ThemedText>
      {icon && (
        <MaterialIcons
          name={icon}
          size={16}
          style={tw`ml-1 text-gray-800 dark:text-white`}
        />
      )}
    </View>
  );
}
