import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useFlashcardStore, Flashcard } from "@/store/flashcardStore";
import { useGroupStore } from "@/store/groupStore";
import { saveReviewData } from "@/db/crud/reviews";
import ThemedIcon from "@/components/ThemedIcon";
import EndResult, { ExamResultItem } from "@/components/EndResult";

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
        console.log(
          "Saving review data to database using custom SM-2 algorithm..."
        );
        results.forEach((result) => {
          if (!result.flashcardId || !flashcardsMap[result.flashcardId]) {
            console.warn(
              `Skipping review data save for missing flashcard: ${result.flashcardId}`
            );
            return;
          }

          try {
            console.log(
              `Saving review with answer time: ${result.timeToAnswer}s for flashcard: ${result.flashcardId}`
            );
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
    <>
      <Stack.Screen
        options={{
          title: `Шалгалтын үр дүн: ${name}` || "Үр дүн",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={goToGroupOverview}>
              <ThemedIcon name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <EndResult
        results={results}
        flashcards={flashcards}
        title={groupName || name || ""}
        onBackPress={goToGroupOverview}
        backButtonTitle={groupName + ` багцруу буцах ` || name || ""}
      />
    </>
  );
}
