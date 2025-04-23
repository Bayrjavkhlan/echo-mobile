import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import tw from "twrnc";
import ThemedIcon from "../ThemedIcon";

export type LabelType = {
  text: string;
  color: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export default function Label({
  data,
  className,
  onPress,
}: {
  data: LabelType;
  className?: string;
  onPress?: () => void;
}) {
  const { text, color, icon } = data;

  const LabelContent = (
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
        <ThemedIcon
          name={icon as keyof typeof MaterialIcons.glyphMap}
          style={tw`m-0 `}
        />
      )}
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress}>{LabelContent}</TouchableOpacity>
  ) : (
    LabelContent
  );
}
