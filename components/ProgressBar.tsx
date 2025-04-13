import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { View } from "react-native";

interface ProgressBarProps {
  totalWords: number;
  memorizedWords: number;
  lightColor?: string;
  darkColor?: string;
  textLightColor?: string;
  textDarkColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  totalWords,
  memorizedWords,
  lightColor = "#E5ECE9",
  darkColor = "#D6D1CD",
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
          <ThemedText>{`Memorized: ${memorizedWords} / ${totalWords} (${percentage.toFixed(
            2
          )}%)`}</ThemedText>
        </ThemedView>
        <ThemedView className="flex flex-row justify-between items-center gap-2">
          <ThemedView
            className="flex-grow rounded"
            lightColor="#AAA"
            darkColor="#D6D1CD"
          >
            <ThemedView
              className="h-2 rounded"
              style={{ width: `${percentage}%` }}
              lightColor="#FE5F55"
              darkColor="#003F35"
            />
          </ThemedView>
          <ThemedText className="flex-shrink-0">{percentage}%</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};
