import React, { Children } from "react";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";

interface OuterViewProps {
  lightColor?: any;
  darkColor?: any;
  children?: React.ReactNode;
  className?: string;
}

export const OuterThemedView: React.FC<OuterViewProps> = ({
  children,
  className,
  lightColor = Colors.light.contentBackground,
  darkColor = Colors.dark.contentBackground,
}) => {
  return (
    <ThemedView
      lightColor={lightColor}
      darkColor={darkColor}
      className={`flex w-full p-4 rounded-xl shadow-md ${className}`}
    >
      {children}
    </ThemedView>
  );
};
