import { colors, sizes } from "@/constants/Themes";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { ReactNode, memo } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  ActivityIndicator,
  AccessibilityProps,
  GestureResponderEvent,
  Text,
} from "react-native";
import tw from "twrnc";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import ThemedIcon from "../ThemedIcon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type ButtonType = "contained" | "outlined" | "text" | "icon";
type ButtonSize = "large" | "middle" | "small";
type ButtonShape = "default" | "circle" | "round";

export interface ButtonProps extends TouchableOpacityProps, AccessibilityProps {
  /** Button text content */
  title?: string;
  /** Visual type of the button */
  type?: ButtonType;
  /** Left icon */
  leftIcon?: ReactNode;
  /** Left icon */
  rightIcon?: ReactNode;
  /** Left icon from Iconsax */
  disabled?: boolean;
  /** Whether to show a loading spinner */
  loading?: boolean;
  /** Custom text styles */
  textClass?: string;
  /** Custom button container styles */
  buttonClass?: string;
  /** Size type of the button */
  size?: ButtonSize;
  /** Custom button shape */
  shape?: ButtonShape;
  /** Custom button color */
  color?: string;
  /** Custom font family */
  fontFamily?: "NotoSerif" | "System" | string;
}

const ButtonComponent = ({
  title,
  onPress = () => {},
  buttonClass,
  textClass = "text-base",
  leftIcon,
  rightIcon,
  disabled = false,
  loading = false,
  type = "contained",
  size = "large",
  shape = "default",
  accessibilityLabel,
  accessibilityHint,
  color = "blue",
  fontFamily = "NotoSerif",
  ...props
}: ButtonProps) => {
  const buttonStyles: StyleProp<ViewStyle> = [
    tw`flex-row items-center justify-center py-1 px-3 rounded-xl bg-${color}-500 w-auto self-start`,
    type === "outlined" && tw`bg-transparent border border-${color}-500`,
    type === "text" && tw`bg-transparent`,
    size === "large" && tw`py-2 px-4`,
    size === "middle" && tw`py-2 px-3`,
    size === "small" && tw`py-1 px-2`,
    shape === "round" && tw`rounded-lg`,
    shape === "circle" && tw`rounded-full`,
    disabled && type !== "text" && tw`bg-gray-200`,
  ];

  const textStyles = [
    { fontFamily },
    tw.style(
      ` text-sm font-medium text-center`,
      size === "large" && "font-semibold",
      textClass,
      disabled && "text-gray-400"
    ),
  ];

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (!disabled && !loading && onPress) {
        onPress(event);
      }
    },
    [disabled, loading, onPress]
  );

  return (
    <TouchableOpacity
      style={[buttonStyles, buttonClass ? tw.style(buttonClass) : null]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled,
        busy: loading,
      }}
      {...props}
    >
      {leftIcon && <View style={tw`m-0`}>{leftIcon}</View>}
      {title && (
        <ThemedText style={textStyles} numberOfLines={1}>
          {title}
        </ThemedText>
      )}
      {rightIcon && (
        <ThemedIcon
          name={rightIcon as keyof typeof MaterialIcons.glyphMap}
          style={tw`m-0 `}
        />
      )}
      {loading && (
        <ActivityIndicator
          size="small"
          color={type === "contained" ? "white" : tw.color(`${color}-500`)}
          style={tw`ml-3`}
        />
      )}
    </TouchableOpacity>
  );
};

export const Button = memo(ButtonComponent);
