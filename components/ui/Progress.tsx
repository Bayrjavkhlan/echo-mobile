import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface ProgressProps {
  percentage: number;
}

export const Progress: React.FC<ProgressProps> = ({ percentage }) => {
  return (
    <ThemedView className="flex flex-row justify-between items-center gap-2">
      <ThemedView
        className="flex-grow rounded"
        lightColor={Colors.light.gray}
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
  );
};
