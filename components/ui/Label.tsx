import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View, Text } from "react-native";
import { useState, useEffect } from "react";
import { ThemedText } from "../ThemedText";
import tw from "twrnc";
import ThemedIcon from "../ThemedIcon";
import { LabelType as StoreLabelType } from "@/store/groupStore";
import { useColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "../ThemedView";

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
  const [isSelected, setIsSelected] = useState(selected);

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

  const labelText = data.text || data.name || "Unknown";
  const { icon } = data;
  const contentBackground = useColor("contentBackground");

  // if (data.id) {
  //   console.log(`Rendering label: ${data.id} - Text: ${labelText}`);
  // }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!selectable && !onPress}
      className={`pr-1 py-0.5 rounded-lg ${className}`}
    >
      <ThemedView
        style={[
          tw`py-1 px-3 rounded-lg w-auto self-start flex flex-row items-center gap-1 justify-center border border-1`,
          isSelected ? tw`border-2 my-0` : tw`my-[2px] border-1`,
          className ? tw`${className}` : null,
        ]}
        customBackgroundColor={contentBackground}
      >
        <ThemedText type="defaultSemiBold" className="text-sm py-[2px] ">
          {labelText}
        </ThemedText>
        {icon && (
          <ThemedIcon
            name={icon as keyof typeof MaterialIcons.glyphMap}
            style={tw`m-0`}
          />
        )}
      </ThemedView>
    </TouchableOpacity>
  );
};

export default Label;
