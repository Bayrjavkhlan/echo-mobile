import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import FlashcardExam from "@/components/FlashcardExam";
import { Flashcard } from "@/store/flashcardStore";
import { format } from "date-fns";
import { mn } from "date-fns/locale";
import { ExamResultItem } from "@/components/EndResult";

export default function DailyReviewScreen() {
  const router = useRouter();
  const { flashcards: flashcardsParam, type } = useLocalSearchParams<{
    flashcards: string;
    type: string;
  }>();
  const [reviewFlashcards, setReviewFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    if (flashcardsParam) {
      try {
        const parsedFlashcards = JSON.parse(flashcardsParam);
        setReviewFlashcards(parsedFlashcards);
        console.log(`Loaded ${parsedFlashcards.length} flashcards for review`);
      } catch (error) {
        console.log("Failed to parse flashcards:", error);
      }
    } else {
      console.warn("No flashcards parameter found in URL");
    }
  }, [flashcardsParam]);

  const handleExamComplete = (results: ExamResultItem[]) => {
    console.log("Review completed with results:", results);

    router.push({
      pathname: "/reviewEnd",
      params: {
        results: JSON.stringify(results),
        type: type || "daily",
      },
    });
  };
  const today = format(new Date(), "yyyy-MM-dd", { locale: mn }); // Or use your desired format

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <ThemedText style={{ fontWeight: "bold", fontSize: 18 }}>
              Шалгалт: {today}
            </ThemedText>
          ),
        }}
      />
      <ThemedView className="flex-1 p-4">
        {reviewFlashcards.length > 0 ? (
          <FlashcardExam
            flashcards={reviewFlashcards}
            onComplete={handleExamComplete}
          />
        ) : (
          <ThemedView className="flex-1 justify-center items-center">
            <ThemedText className="text-lg">
              Өнөөдөр шалгах флашкарт байхгүй байна
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
