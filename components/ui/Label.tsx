import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { ThemedText } from "../ThemedText";
import tw from "twrnc";
import ThemedIcon from "../ThemedIcon";

export type LabelType = {
  id?: number;
  text: string;
  color: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export default function Label({
  data,
  className,
  onPress,
  selectable = true,
}: {
  data: LabelType;
  className?: string;
  onPress?: () => void;
  selectable?: boolean;
}) {
  const { text, color, icon } = data;
  const [selected, setSelected] = useState(false);

  const toggleSelected = () => {
    onPress?.();
    if (selectable) {
      setSelected((prev) => !prev);
    }
  };

  const LabelContent = (
    <View
      style={[
        tw`bg-${color}-400 border border-${color}-700 py-1 px-3 rounded-xl w-auto self-start flex flex-row items-center gap-1 justify-center`,
        selected ? tw`border-2 border-dashed my-0` : tw`my-[2px]`,
        className ? tw.style(className) : null,
      ]}
    >
      <ThemedText type="defaultSemiBold" className="text-sm py-[2px] ">
        {text}
      </ThemedText>
      {icon && (
        <ThemedIcon
          name={icon as keyof typeof MaterialIcons.glyphMap}
          style={tw`m-0`}
        />
      )}
    </View>
  );

  return (
    <TouchableOpacity onPress={toggleSelected}>{LabelContent}</TouchableOpacity>
  );
}
