import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface WordSuggestionProps {
  count: number;
  word: string;
}

export const WordSuggestion: React.FC<WordSuggestionProps> = (props) => {
  return (
    <ThemedView>
      <ThemedText>test word suggestion</ThemedText>
    </ThemedView>
  );
};
