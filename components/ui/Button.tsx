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
import { useColor } from "@/hooks/useThemeColor";

type ButtonType = "contained" | "outlined" | "text" | "icon";
type ButtonSize = "extra" | "large" | "middle" | "small";
type ButtonShape = "default" | "circle" | "round";

export interface ButtonProps extends TouchableOpacityProps, AccessibilityProps {
  title?: string;
  type?: ButtonType;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconSize?: number;
  disabled?: boolean;
  loading?: boolean;
  textClass?: string;
  buttonClass?: string;
  size?: ButtonSize;
  shape?: ButtonShape;
  color?: string;
  fontFamily?: "Roboto_400Regular" | "System" | string;
  alignRightIcon?: boolean;
}

const ButtonComponent = ({
  title,
  onPress = () => {},
  buttonClass,
  textClass = "text-base",
  leftIcon,
  rightIcon,
  iconSize,
  disabled = false,
  loading = false,
  type = "contained",
  size = "large",
  shape = "default",
  accessibilityLabel,
  accessibilityHint,
  color = useColor("blue"),
  fontFamily = "Roboto_400Regular",
  alignRightIcon = false,
  ...props
}: ButtonProps) => {
  const buttonStyles: StyleProp<ViewStyle> = [
    tw`flex-row items-center justify-center py-1 px-3 rounded-xl bg-[${color}] `,
    type === "outlined" && tw`bg-transparent border border-[${color}]`,
    type === "text" && tw`bg-transparent`,
    type === "icon" && tw`p-0`,
    type === "icon" &&
      shape === "circle" &&
      tw`w-9 h-9 justify-center items-center p-0`,
    size === "extra" && tw`py-4 px-5`,
    size === "large" && tw`py-2 px-4`,
    size === "middle" && tw`py-2 px-3`,
    size === "small" && tw`py-1 px-2 rounded-lg`,
    shape === "round" && tw`rounded-lg`,
    shape === "circle" && tw`rounded-full`,
    disabled && type !== "text" && tw`bg-gray-200`,
  ];

  const textStyles = [
    { fontFamily },
    tw.style(
      ` text-sm font-medium text-center flex items-center`,
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
      <View style={tw`flex-row w-full justify-center items-center`}>
        <View style={tw`flex-row items-center`}>
          {leftIcon && <View style={tw`mr-2`}>{leftIcon}</View>}
          {title && (
            <ThemedText style={textStyles} numberOfLines={1}>
              {title}
            </ThemedText>
          )}
        </View>
        {alignRightIcon && (
          <View style={tw`ml-auto flex-row items-center`}>
            {rightIcon && (
              <ThemedIcon
                name={rightIcon as keyof typeof MaterialIcons.glyphMap}
                size={iconSize}
                style={tw`m-0 p-0`}
              />
            )}
            {loading && (
              <ActivityIndicator
                size="small"
                color={
                  type === "contained" ? "white" : tw.color(`${color}-500`)
                }
                style={tw`ml-2`}
              />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const Button = memo(ButtonComponent);
