import React, { useState } from "react";
import { TextInput, Animated, Easing } from "react-native";
import { ThemedView } from "../ThemedView";
import tw from "twrnc";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

interface InputProps {
  title: string;
  backgroundColor?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  className,
  title,
  backgroundColor,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("");
  const labelAnim = useState(new Animated.Value(text ? 1 : 0))[0];
  const contentBackground = useThemeColor(
    {
      light: Colors.light.contentBackground,
      dark: Colors.dark.contentBackground,
    },
    "background"
  );

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
    if (text === "") {
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
    color: isFocused ? "#3b82f6" : "#aaa",
    paddingHorizontal: 4,
    backgroundColor: backgroundColor || contentBackground,
    zIndex: 2,
  };
  return (
    <ThemedView className="flex-1">
      <ThemedView className="relative">
        <Animated.Text style={labelStyle}>{title}</Animated.Text>
        <TextInput
          value={text}
          onChangeText={setText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={tw.style(
            "w-full pt-5 pb-2 px-2 rounded-lg border border-black dark:border-gray-600 text-base mb-4",
            className
          )}
        />
      </ThemedView>
    </ThemedView>
  );
};
