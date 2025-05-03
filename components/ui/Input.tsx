import React, { useState } from "react";
import { TextInput, Animated, Easing, Pressable, View } from "react-native";
import { ThemedView } from "../ThemedView";
import tw from "twrnc";
import { useColor, useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import ThemedIcon from "../ThemedIcon";

interface InputProps {
  title: string;
  backgroundColor?: string;
  className?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  hasError?: boolean;
  noBackgroundColor?: boolean;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  className,
  title,
  backgroundColor,
  value,
  onChangeText,
  hasError,
  noBackgroundColor,
  rightIcon,
  onRightIconPress,
}) => {
  const colorRed = useColor("red");
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
    paddingVertical: 0,
    marginVertical: 0,
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
            `w-full pt-5  px-2 rounded-lg border text-[${textColor}]  ${
              hasError
                ? `border-[${redColor}]`
                : "border-black dark:border-gray-600"
            } text-base mb-4`,
            className
          )}
        />
        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            style={tw`absolute right-3 top-4`}
            hitSlop={10}
          >
            <ThemedIcon name="close" size={24} color={colorRed} />
          </Pressable>
        )}
      </ThemedView>
    </ThemedView>
  );
};
