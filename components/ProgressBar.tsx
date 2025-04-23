import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { View } from "react-native";
import { Colors } from "@/constants/Colors";
import { colors } from "@/constants/Themes";

interface ProgressBarProps {
  totalWords: number;
  memorizedWords: number;
  lightColor?: any;
  darkColor?: any;
  textLightColor?: string;
  textDarkColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  totalWords,
  memorizedWords,
  lightColor = Colors.light.contentBackground,
  darkColor = Colors.dark.contentBackground,
}) => {
  // const percentage = (memorizedWords / totalWords) * 100;
  const percentage = 80;

  return (
    <ThemedView className="flex-1 p-4 pb-2">
      <ThemedView
        lightColor={lightColor}
        darkColor={darkColor}
        className="flex w-full h-18 p-4 rounded-xl"
      >
        <ThemedView className="flex justify-between">
          <ThemedText>{`Цээжилсэн үгсийн тоо: ${memorizedWords} / ${totalWords} (${percentage.toFixed(
            2
          )}%)`}</ThemedText>
        </ThemedView>
        <ThemedView className="flex flex-row justify-between items-center gap-2">
          <ThemedView
            className="flex-grow rounded"
            lightColor={Colors.light.gray}
            // lightColor={colors.primary300}
            darkColor={Colors.dark.gray}
          >
            <ThemedView
              className="h-2 rounded"
              style={{ width: `${percentage}%` }}
              lightColor={Colors.light.red}
              darkColor={Colors.dark.red}
            />
          </ThemedView>
          <ThemedText className="flex-shrink-0">{percentage}%</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};
