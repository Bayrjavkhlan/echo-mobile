import { Colors } from "@/constants/Colors";
import HorizontalLabelScroll from "./HorizontalLabelScroll";
import { OuterThemedView } from "./OuterThemedView";
import ThemedIcon from "./ThemedIcon";
import { ThemedView } from "./ThemedView";
import { Input } from "./ui/Input";
import { View, TouchableOpacity } from "react-native";
import tw from "twrnc";

interface FlashcardAddProps {
  onDelete?: () => void;
  question: string;
  answer: string;
  onChangeQuestion: (text: string) => void;
  onChangeAnswer: (text: string) => void;
  hasError?: boolean;
}

export default function FlashcardAdd({
  onDelete,
  question,
  answer,
  onChangeQuestion,
  onChangeAnswer,
  hasError,
}: FlashcardAddProps) {
  return (
    <ThemedView className="flex-1 p-4">
      <View style={tw`relative`}>
        <OuterThemedView className="p-6">
          <Input
            title="Асуулт"
            value={question}
            onChangeText={onChangeQuestion}
            hasError={hasError}
          />
          <Input
            title="Хариулт"
            value={answer}
            onChangeText={onChangeAnswer}
            hasError={hasError}
          />
          <HorizontalLabelScroll className="py-0" />
        </OuterThemedView>

        {onDelete && (
          <TouchableOpacity
            style={tw`absolute top-0 right-[-1] rounded-full px-2 py-1`}
            onPress={onDelete}
          >
            <ThemedIcon
              name="close"
              size={24}
              lightColor={Colors.light.red}
              darkColor={Colors.dark.red}
            />
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}
