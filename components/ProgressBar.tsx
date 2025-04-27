import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Progress } from "./ui/Progress";
import { OuterThemedView } from "./OuterThemedView";

interface ProgressBarProps {
  totalWords: number;
  memorizedWords: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  totalWords,
  memorizedWords,
}) => {
  const percentage =
    totalWords > 0 ? Math.round((memorizedWords / totalWords) * 100) : 0;

  return (
    <ThemedView className="flex-1 p-4 pb-2">
      <OuterThemedView className="flex w-full p-4 rounded-xl">
        <ThemedView className="flex justify-between mb-2">
          <ThemedText>{`Цээжилсэн үгсийн тоо: ${memorizedWords} / ${totalWords} (${percentage}%)`}</ThemedText>
        </ThemedView>
        <Progress percentage={percentage} />
      </OuterThemedView>
    </ThemedView>
  );
};
