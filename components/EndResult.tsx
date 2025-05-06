import React from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Flashcard } from "@/store/flashcardStore";
import ThemedIcon from "@/components/ThemedIcon";

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
      <ThemedView className="bg-white p-4 rounded-xl mb-4">
        <View style={styles.statRow}>
          <ThemedText className="text-gray-600">Нийт асуулт:</ThemedText>
          <ThemedText className="font-bold">{totalQuestions}</ThemedText>
        </View>
        <View style={styles.statRow}>
          <ThemedText className="text-gray-600">Зөв харуилсан</ThemedText>
          <ThemedText className="font-bold">{correctAnswers}</ThemedText>
        </View>
        <View style={styles.statRow}>
          <ThemedText className="text-gray-600">Зөв хариулсан хувь:</ThemedText>
          <ThemedText className="font-bold">{accuracy.toFixed(1)}%</ThemedText>
        </View>
        <View style={styles.statRow}>
          <ThemedText className="text-gray-600">
            Хариулсан дундаж хугацаа:
          </ThemedText>
          <ThemedText className="font-bold">
            {avgTime.toFixed(1)} секунд
          </ThemedText>
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
              className={`mb-4 p-4 rounded-xl ${
                result.correct ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <ThemedText className="text-lg font-bold mb-1">
                Асуулт № {index + 1}: {result.correct ? "✓" : "✗"}
              </ThemedText>
              <ThemedText className="mb-2">{flashcard.question}</ThemedText>
              <View style={styles.answerRow}>
                <ThemedText className="text-gray-600">Зөв хариулт:</ThemedText>
                <ThemedText className="font-bold text-green-600">
                  {flashcard.answer}
                </ThemedText>
              </View>
              {result.userAnswer && result.userAnswer !== flashcard.answer && (
                <View style={styles.answerRow}>
                  <ThemedText className="text-gray-600">
                    Таны хариулт:
                  </ThemedText>
                  <ThemedText className="font-bold text-red-600">
                    {result.userAnswer}
                  </ThemedText>
                </View>
              )}
              <ThemedText className="text-xs text-gray-500 mt-2">
                Хариулсан хугацаа: {result.timeToAnswer} секунд
              </ThemedText>
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
    marginVertical: 2,
  },
});
