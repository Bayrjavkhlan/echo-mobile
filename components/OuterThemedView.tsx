import React from "react";
import { ViewStyle } from "react-native";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";

interface OuterViewProps {
  lightColor?: any;
  darkColor?: any;
  children?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  noBackgroundColor?: boolean;
  customBackgroundColor?: string;
}

export const OuterThemedView: React.FC<OuterViewProps> = ({
  children,
  className,
  style,
  lightColor = Colors.light.contentBackground,
  darkColor = Colors.dark.contentBackground,
  noBackgroundColor = false,
  customBackgroundColor,
}) => {
  return (
    <ThemedView
      lightColor={lightColor}
      darkColor={darkColor}
      className={`flex w-full p-4 pt-8 rounded-xl shadow-md ${className || ""}`}
      style={style}
      noBackgroundColor={noBackgroundColor}
      customBackgroundColor={customBackgroundColor}
    >
      {children}
    </ThemedView>
  );
};
