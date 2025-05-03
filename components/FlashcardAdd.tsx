import HorizontalLabelScroll from "./HorizontalLabelScroll";
import { OuterThemedView } from "./OuterThemedView";
import ThemedIcon from "./ThemedIcon";
import { ThemedView } from "./ThemedView";
import { Input } from "./ui/Input";
import { View, TouchableOpacity, Pressable } from "react-native";
import tw from "twrnc";
import { LabelType } from "./ui/Label";
import { useColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { Button } from "./ui/Button";

interface FlashcardAddProps {
  onDelete?: () => void;
  question: string;
  answer: string;
  onChangeQuestion: (text: string) => void;
  onChangeAnswer: (text: string) => void;
  hasError?: boolean;
  labels: LabelType[];
  onChangeLabels: (labels: LabelType[]) => void;
  wrongAnswers?: string[];
  onChangeWrongAnswers?: (answers: string[]) => void;
}

export default function FlashcardAdd({
  onDelete,
  question,
  answer,
  onChangeQuestion,
  onChangeAnswer,
  hasError,
  labels,
  onChangeLabels,
  wrongAnswers,
  onChangeWrongAnswers,
}: FlashcardAddProps) {
  const colorRed = useColor("red");

  const [wrongAnswersVisibility, setWrongAnswersVisibility] = useState(false);
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
          <HorizontalLabelScroll
            className="py-0"
            selectedLabels={labels}
            onChangeSelectedLabels={onChangeLabels}
          />

          {/* {wrongAnswersVisibility && onChangeWrongAnswers && (
            <View style={tw`mt-4`}>
              {(wrongAnswers ?? []).map((item, i) => (
                <Input
                  key={i}
                  title={`Буруу хариулт ${i + 1}`}
                  value={item}
                  onChangeText={(text) => {
                    const updated = [...(wrongAnswers ?? [])];
                    updated[i] = text;
                    onChangeWrongAnswers(updated);
                  }}
                  rightIcon="close"
                  onRightIconPress={() => {
                    const updated = [...(wrongAnswers ?? [])];
                    updated.splice(i, 1);
                    onChangeWrongAnswers(updated);
                  }}
                />
              ))}

              <Button
                title="Буруу хариулт нэмэх"
                className="mt-2"
                onPress={() =>
                  onChangeWrongAnswers([...(wrongAnswers ?? []), ""])
                }
              />
            </View>
          )}
          <Pressable
            onPress={() => setWrongAnswersVisibility(!wrongAnswersVisibility)}
          >
            <ThemedView className="w-full justify-center items-center mb-[-20px]">
              <ThemedIcon
                name={
                  wrongAnswersVisibility
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={24}
              />
            </ThemedView>
          </Pressable> */}
        </OuterThemedView>

        {onDelete && (
          <TouchableOpacity
            style={tw`absolute top-0 right-[-1] rounded-full px-2 py-1`}
            onPress={onDelete}
          >
            <ThemedIcon name="close" size={24} color={colorRed} />
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}
