import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { ThemedText } from "./ThemedText";
import ThemedIcon from "./ThemedIcon";

export type LabelType = {
  text: string;
  color: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export default function LabelAdd({
  data,
  className,
  onPress,
}: {
  data?: LabelType;
  className?: string;
  onPress?: () => void;
}) {
  const { text = "нэмэх", color = "slate", icon = "add" } = data || {};

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          tw`py-1 px-3 rounded-xl w-auto self-start flex flex-row items-center justify-center`,
          tw`bg-${color}-400 border border-${color}-700`,
          className ? tw.style(className) : null,
        ]}
      >
        <ThemedText type="defaultSemiBold" className="text-sm mr-1">
          {text}
        </ThemedText>
        <ThemedIcon name={icon} style={tw`m-0`} />
      </View>
    </TouchableOpacity>
  );
}
