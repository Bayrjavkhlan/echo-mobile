import React from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Flashcard } from "@/store/flashcardStore";
import ThemedIcon from "@/components/ThemedIcon";
import { useColor } from "@/hooks/useThemeColor";

export type ExamResultItem = {
  flashcardId: string;
  correct: boolean;
  timeToAnswer: number;
  userAnswer?: string;
};

type EndResultProps = {
  results: ExamResultItem[];
  flashcards: Record<string, Flashcard>;
  title?: string;
  onBackPress: () => void;
  backButtonTitle: string;
};

export default function EndResult({
  results,
  flashcards,
  title,
  onBackPress,
  backButtonTitle,
}: EndResultProps) {
  const colorRed = useColor("red");
  const colorGreen = useColor("green");
  const colorGray = useColor("gray");
  const totalQuestions = results.length;
  const correctAnswers = results.filter((r) => r.correct).length;
  const accuracy =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const avgTime =
    totalQuestions > 0
      ? results.reduce((sum, r) => sum + r.timeToAnswer, 0) / totalQuestions
      : 0;

  return (
    <ThemedView className="flex-1 p-4">
      <ThemedText className="text-2xl font-bold mb-2">
        Шалгалтын хураангуй
      </ThemedText>
      <ThemedView className="p-4 rounded-xl mb-4">
        <View style={styles.statRow}>
          <ThemedText textColor={colorGray}>Нийт асуулт:</ThemedText>
          <ThemedText>{totalQuestions}</ThemedText>
        </View>
        <View style={styles.statRow}>
          <ThemedText textColor={colorGray}>Зөв хариулсан тоо:</ThemedText>
          <ThemedText>{correctAnswers}</ThemedText>
        </View>
        <View style={styles.statRow}>
          <ThemedText textColor={colorGray}>Зөв хариулсан хувь:</ThemedText>
          <ThemedText>{accuracy.toFixed(1)}%</ThemedText>
        </View>
        <View style={styles.statRow}>
          <ThemedText textColor={colorGray}>
            Хариулсан дундаж хугацаа:
          </ThemedText>
          <ThemedText>{avgTime.toFixed(1)} секунд</ThemedText>
        </View>
      </ThemedView>

      <ThemedText className="text-xl font-bold mb-2">
        Дэлгэрэнгүй үр дүн
      </ThemedText>
      <ScrollView style={styles.scrollView}>
        {results.map((result, index) => {
          const flashcard = flashcards[result.flashcardId];
          if (!flashcard) return null;

          return (
            <ThemedView
              key={index}
              className={`mb-2 p-4 rounded-xl ${
                result.correct ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <View style={styles.answerRow}>
                <ThemedView className="flex-row items-center mb-1">
                  <ThemedText className="text-lg  mr-2">
                    Асуулт № {index + 1}:
                  </ThemedText>
                  <ThemedIcon
                    name={result.correct ? "check" : "close"}
                    size={22}
                    color={result.correct ? colorGreen : colorRed}
                  />
                </ThemedView>
                <ThemedText className="mb-2">{flashcard.question}</ThemedText>
              </View>

              <View style={styles.answerRow}>
                <ThemedText textColor={colorGray}>Зөв хариулт:</ThemedText>
                <ThemedText textColor={colorGreen}>
                  {flashcard.answer}
                </ThemedText>
              </View>
              {result.userAnswer && result.userAnswer !== flashcard.answer && (
                <View style={styles.answerRow}>
                  <ThemedText textColor={colorGray}>
                    Сонгосон хариулт:
                  </ThemedText>
                  <ThemedText textColor={colorRed}>
                    {result.userAnswer}
                  </ThemedText>
                </View>
              )}
              <View style={styles.answerRow}>
                <ThemedText textColor={colorGray}>
                  Хариулсан хугацаа:
                </ThemedText>
                <ThemedText>{result.timeToAnswer} секунд</ThemedText>
              </View>
            </ThemedView>
          );
        })}
      </ScrollView>

      <Button
        title={backButtonTitle}
        onPress={onBackPress}
        buttonClass="mt-4"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  answerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 1,
  },
});
