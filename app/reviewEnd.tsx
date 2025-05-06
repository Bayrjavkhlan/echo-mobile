import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useFlashcardStore, Flashcard } from "@/store/flashcardStore";
import { saveReviewData } from "@/db/crud/reviews";
import ThemedIcon from "@/components/ThemedIcon";
import EndResult, { ExamResultItem } from "@/components/EndResult";

export default function ReviewEndScreen() {
  const { type = "daily" } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const params = useLocalSearchParams<{ results: string }>();
  const [results, setResults] = useState<ExamResultItem[]>([]);
  const [flashcards, setFlashcards] = useState<Record<string, Flashcard>>({});
  const { fetchFlashcards, flashcards: allFlashcards } = useFlashcardStore();

  useEffect(() => {
    if (params.results) {
      try {
        const parsedResults = JSON.parse(params.results);
        setResults(parsedResults);
        console.log("Review results:", parsedResults);
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
            // For daily reviews, we don't have a specific group
            // Use the flashcard's groupId instead
            const groupId = flashcardsMap[result.flashcardId].groupId || "0";

            saveReviewData({
              flashcardId: result.flashcardId,
              correct: result.correct,
              timeToAnswer: result.timeToAnswer,
              groupId: groupId,
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
  }, [allFlashcards, results]);

  const handleGoBack = () => {
    router.push("/(tabs)");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `Шалгалтын үр дүн: ${name}` || "Үр дүн",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(tabs)",
                });
              }}
            >
              <ThemedIcon name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <EndResult
        results={results}
        flashcards={flashcards}
        onBackPress={handleGoBack}
        backButtonTitle="Return to Home"
      />
    </>
  );
}
