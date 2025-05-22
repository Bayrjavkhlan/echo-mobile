import HorizontalLabelScroll from "./HorizontalLabelScroll";
import { OuterThemedView } from "./OuterThemedView";
import ThemedIcon from "./ThemedIcon";
import { ThemedView } from "./ThemedView";
import { Input } from "./ui/Input";
import { View, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import tw from "twrnc";
import { LabelType } from "./ui/Label";
import { useColor } from "@/hooks/useThemeColor";

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
  className?: string;
  wrongAnswerAddEnabled?: boolean;
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
  className,
  wrongAnswerAddEnabled = true,
}: FlashcardAddProps) {
  const colorRed = useColor("red");

  return (
    <ThemedView style={styles.container} noBackgroundColor>
      <View style={styles.contentWrapper}>
        <OuterThemedView className={className}>
          <Input
            title="Асуулт"
            value={question}
            onChangeText={onChangeQuestion}
            hasError={hasError}
            multiline={true}
            textInputStyle={styles.textInput}
          />
          <Input
            title="Хариулт"
            value={answer}
            onChangeText={onChangeAnswer}
            hasError={hasError}
            multiline={true}
            textInputStyle={styles.textInput}
          />
          <View>
            <HorizontalLabelScroll
              selectedLabels={labels}
              onChangeSelectedLabels={onChangeLabels}
            />
          </View>

          {wrongAnswerAddEnabled &&
            onChangeWrongAnswers &&
            wrongAnswers &&
            wrongAnswers.length > 0 && (
              <View style={{ width: "100%", marginTop: 8 }}>
                {wrongAnswers.map((wa, idx) => (
                  <ThemedView
                    key={idx}
                    className="flex flex-row justify-center items-center gap-4"
                  >
                    <Input
                      title={`Буруу хариулт ${idx + 1}`}
                      value={wa}
                      onChangeText={(text) => {
                        const updated = [...wrongAnswers];
                        updated[idx] = text;
                        onChangeWrongAnswers(updated);
                      }}
                      multiline={true}
                    />
                    <TouchableOpacity
                      style={tw`flex  justify-center items-center self-center  mb-4`}
                      onPress={() => {
                        const updated = wrongAnswers.filter(
                          (_, i) => i !== idx
                        );
                        onChangeWrongAnswers(updated);
                      }}
                    >
                      <ThemedIcon name="close" size={24} color={colorRed} />
                    </TouchableOpacity>
                  </ThemedView>
                ))}
              </View>
            )}
          <ThemedView className="w-full flex items-center pb-0">
            <Pressable
              onPress={() => {
                if (onChangeWrongAnswers) {
                  const newAnswers = wrongAnswers
                    ? [...wrongAnswers, ""]
                    : [""];
                  onChangeWrongAnswers(newAnswers);
                }
              }}
            >
              <ThemedIcon name="keyboard-arrow-down" size={24} />
            </Pressable>
          </ThemedView>
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 0,
    marginBottom: 16,
  },
  contentWrapper: {
    position: "relative",
  },
  textInput: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 25,
  },
});
