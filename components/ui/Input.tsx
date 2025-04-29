import React, { useState } from "react";
import { TextInput, Animated, Easing } from "react-native";
import { ThemedView } from "../ThemedView";
import tw from "twrnc";
import { useColor, useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

interface InputProps {
  title: string;
  backgroundColor?: string;
  className?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  hasError?: boolean;
  noBackgroundColor?: boolean;
}

export const Input: React.FC<InputProps> = ({
  className,
  title,
  backgroundColor,
  value,
  onChangeText,
  hasError,
  noBackgroundColor,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useState(new Animated.Value(value ? 1 : 0))[0];
  const contentBackground = useColor("contentBackground");
  const textColor = useColor("text");
  const titleColor = useColor("title");
  const redColor = useColor("red");
  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(labelAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const handleBlur = () => {
    if (value === "") {
      setIsFocused(false);
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  };

  const labelStyle = {
    position: "absolute" as const,
    left: 10,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: isFocused ? titleColor : "#aaa",
    paddingHorizontal: 4,
    backgroundColor: noBackgroundColor
      ? "undefined"
      : backgroundColor || contentBackground,
    textColor: "#fff",
    zIndex: 2,
  };

  return (
    <ThemedView
      className="flex-1 justify-center"
      customBackgroundColor={backgroundColor}
    >
      <ThemedView className="relative" customBackgroundColor={backgroundColor}>
        <Animated.Text style={labelStyle}>{title}</Animated.Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={tw.style(
            `w-full pt-5 pb-2 px-2 rounded-lg border text-[${textColor}]  ${
              hasError
                ? `border-[${redColor}]`
                : "border-black dark:border-gray-600"
            } text-base mb-4`,
            className
          )}
        />
      </ThemedView>
    </ThemedView>
  );
};
