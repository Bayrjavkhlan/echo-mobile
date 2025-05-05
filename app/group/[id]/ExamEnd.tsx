import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  useLocalSearchParams,
  Stack,
  useRouter,
} from "expo-router";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button } from "@/components/ui/Button";
import { useFlashcardStore, Flashcard } from "@/store/flashcardStore";
import { useGroupStore } from "@/store/groupStore";
import { saveReviewData } from "@/db/crud/reviews";

export type ExamResultItem = {
  flashcardId: string;
  correct: boolean;
  timeToAnswer: number;
  userAnswer?: string;
};

export default function ExamEndScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const params = useLocalSearchParams<{ results: string }>();
  const [results, setResults] = useState<ExamResultItem[]>([]);
  const [flashcards, setFlashcards] = useState<Record<string, Flashcard>>({});
  const { fetchFlashcards, flashcards: allFlashcards } = useFlashcardStore();
  const { fetchGroupById, currentGroup } = useGroupStore();
  const [groupName, setGroupName] = useState<string>(name || "");

  useEffect(() => {
    if (!name && groupId) {
      console.log("Name not provided in params, fetching from group store");
      fetchGroupById(groupId);
    }
  }, [groupId, name, fetchGroupById]);

  useEffect(() => {
    if (currentGroup && !groupName) {
      console.log("Retrieved group name from store:", currentGroup.title);
      setGroupName(currentGroup.title);
    }
  }, [currentGroup, groupName]);

  useEffect(() => {
    if (params.results) {
      try {
        const parsedResults = JSON.parse(params.results);
        setResults(parsedResults);
        console.log("Exam results:", parsedResults);
      } catch (error) {
        console.error("Failed to parse results:", error);
      }
    } else {
      console.warn("No results parameter found in URL");
    }
  }, [params.results]);

  useEffect(() => {
    console.log("Fetching flashcards...");
    fetchFlashcards().catch((error) => {
      console.error("Error fetching flashcards:", error);
    });
  }, [fetchFlashcards]);

  useEffect(() => {
    console.log(`Loaded ${allFlashcards.length} flashcards from store`);
  }, [allFlashcards]);

  useEffect(() => {
    console.log(
      `Mapping ${results.length} results to ${allFlashcards.length} flashcards`
    );

    if (allFlashcards.length > 0 && results.length > 0) {
      const flashcardsMap: Record<string, Flashcard> = {};

      results.forEach((result) => {
        if (!result.flashcardId) {
          console.error("Found result with missing flashcardId:", result);
          return;
        }

        console.log(`Looking for flashcard with ID: ${result.flashcardId}`);

        const flashcard = allFlashcards.find(
          (f) => f && f.id === result.flashcardId
        );

        if (flashcard) {
          console.log(`Found matching flashcard: ${flashcard.question}`);
          flashcardsMap[result.flashcardId] = flashcard;
        } else {
          console.error(
            `Flashcard with ID ${result.flashcardId} not found in allFlashcards array`
          );
          console.log(
            "Available flashcard IDs:",
            allFlashcards.slice(0, 5).map((f) => f?.id)
          );
        }
      });

      console.log(
        `Created flashcardsMap with ${
          Object.keys(flashcardsMap).length
        } entries`
      );
      setFlashcards(flashcardsMap);

      if (Object.keys(flashcardsMap).length > 0) {
        console.log("Saving review data to database...");
        results.forEach((result) => {
          if (!result.flashcardId || !flashcardsMap[result.flashcardId]) {
            console.warn(
              `Skipping review data save for missing flashcard: ${result.flashcardId}`
            );
            return;
          }

          try {
            saveReviewData({
              flashcardId: result.flashcardId,
              correct: result.correct,
              timeToAnswer: result.timeToAnswer,
              groupId: groupId || "",
              userAnswer: result.userAnswer || "",
            });
          } catch (error) {
            console.error(
              `Error saving review for flashcard ${result.flashcardId}:`,
              error
            );
          }
        });
      } else {
        console.error("No flashcards found in map, skipping review data save");
      }
    } else {
      console.warn(
        `Cannot map results to flashcards: results=${results.length}, flashcards=${allFlashcards.length}`
      );
    }
  }, [allFlashcards, results, groupId]);

  const totalQuestions = results.length;
  const correctAnswers = results.filter((r) => r.correct).length;
  const accuracy =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const avgTime =
    totalQuestions > 0
      ? results.reduce((sum, r) => sum + r.timeToAnswer, 0) / totalQuestions
      : 0;

  const goToGroupOverview = () => {
    console.log(
      "Going to group overview with name:",
      groupName || name || "Unknown Group"
    );
    if (groupId) {
      router.push({
        pathname: "/group/[id]/Overview",
        params: {
          id: groupId,
          name: groupName || name || "",
        },
      });
    } else {
      router.push("/(tabs)");
    }
  };

  return (
    <ThemedView className="flex-1 p-4">
      <Stack.Screen options={{ title: "Exam Results" }} />

      <ThemedView className="bg-white p-4 rounded-xl mb-4">
        <ThemedText className="text-2xl font-bold mb-2">
          Exam Summary
        </ThemedText>
        <View style={styles.statRow}>
          <ThemedText className="text-gray-600">Total Questions:</ThemedText>
          <ThemedText className="font-bold">{totalQuestions}</ThemedText>
        </View>
        <View style={styles.statRow}>
          <ThemedText className="text-gray-600">Correct Answers:</ThemedText>
          <ThemedText className="font-bold">{correctAnswers}</ThemedText>
        </View>
        <View style={styles.statRow}>
          <ThemedText className="text-gray-600">Accuracy:</ThemedText>
          <ThemedText className="font-bold">{accuracy.toFixed(1)}%</ThemedText>
        </View>
        <View style={styles.statRow}>
          <ThemedText className="text-gray-600">Average Time:</ThemedText>
          <ThemedText className="font-bold">
            {avgTime.toFixed(1)} seconds
          </ThemedText>
        </View>
      </ThemedView>

      <ThemedText className="text-xl font-bold mb-2">
        Detailed Results
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
                Question {index + 1}: {result.correct ? "✓" : "✗"}
              </ThemedText>
              <ThemedText className="mb-2">{flashcard.question}</ThemedText>
              <View style={styles.answerRow}>
                <ThemedText className="text-gray-600">
                  Correct answer:
                </ThemedText>
                <ThemedText className="font-bold text-green-600">
                  {flashcard.answer}
                </ThemedText>
              </View>
              {result.userAnswer && result.userAnswer !== flashcard.answer && (
                <View style={styles.answerRow}>
                  <ThemedText className="text-gray-600">
                    Your answer:
                  </ThemedText>
                  <ThemedText className="font-bold text-red-600">
                    {result.userAnswer}
                  </ThemedText>
                </View>
              )}
              <ThemedText className="text-xs text-gray-500 mt-2">
                Time to answer: {result.timeToAnswer} seconds
              </ThemedText>
            </ThemedView>
          );
        })}
      </ScrollView>

      <Button
        title="Back to Group"
        onPress={goToGroupOverview}
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
