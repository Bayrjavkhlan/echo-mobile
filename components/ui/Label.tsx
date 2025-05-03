import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View, Text } from "react-native";
import { useState, useEffect } from "react";
import { ThemedText } from "../ThemedText";
import tw from "twrnc";
import ThemedIcon from "../ThemedIcon";
import { LabelType as StoreLabelType } from "@/store/groupStore";
import { useColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

export type LabelType = {
  id?: string | number;
  text?: string;
  name?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

interface LabelProps {
  data: LabelType;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
  selectable?: boolean;
}

const Label = ({
  data,
  selected = false,
  onPress,
  className,
  selectable = true,
}: LabelProps) => {
  const textLight = Colors.light.text;
  const textDark = Colors.dark.text;
  const bgLight = Colors.light.background;
  const bgDark = Colors.dark.background;
  // const isDark = useColor("scheme") === "dark";
  const [isSelected, setIsSelected] = useState(selected);

  // Update internal state when external selected prop changes
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  const handlePress = () => {
    if (selectable) {
      setIsSelected(!isSelected);
    }
    if (onPress) {
      onPress();
    }
  };

  // Determine the label text to display, preferring text over name
  const labelText = data.text || data.name || "Unknown";
  const { icon } = data;

  // Only log for actual labels (not for the add button)
  if (data.id) {
    console.log(`Rendering label: ${data.id} - Text: ${labelText}`);
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!selectable && !onPress}
      className={`px-1 py-0.5 rounded-lg ${className}`}
      style={{
        borderWidth: 1,
        borderColor: isSelected
          ? isDark
            ? "#000"
            : "#ccc"
          : isDark
          ? "#000"
          : "#ccc",
        backgroundColor: isSelected
          ? isDark
            ? Colors.dark.tint
            : Colors.light.tint
          : isDark
          ? bgDark
          : bgLight,
      }}
    >
      <View
        style={[
          tw`py-1 px-3 rounded-lg w-auto self-start flex flex-row items-center gap-1 justify-center`,
          isSelected ? tw`border-2 border-dashed my-0` : tw`my-[2px]`,
        ]}
      >
        <Text
          className="text-sm"
          style={{
            color: isSelected ? "#fff" : isDark ? textDark : textLight,
          }}
        >
          {labelText}
        </Text>
        {icon && <ThemedIcon name={icon} size={16} style={tw`ml-1`} />}
      </View>
    </TouchableOpacity>
  );
};

export default Label;
