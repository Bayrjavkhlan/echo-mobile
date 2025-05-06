import React, { useState, useEffect } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/Button";
import { useRouter } from "expo-router";
import { getFlashcardsDueForReview } from "@/db/crud/reviews";
import { OuterThemedView } from "./OuterThemedView";

export default function WordSuggestion() {
  const router = useRouter();
  const [dueFlashcards, setDueFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDueFlashcards();
  }, []);

  const loadDueFlashcards = async () => {
    try {
      setLoading(true);
      const flashcards = await getFlashcardsDueForReview();
      setDueFlashcards(Array.isArray(flashcards) ? flashcards : []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading due flashcards:", error);
      setLoading(false);
    }
  };

  const handleTodayExam = () => {
    if (dueFlashcards.length === 0) {
      console.log("No flashcards due for review");
      return;
    }

    const examFlashcards = dueFlashcards.map((card) => ({
      id: String(card.id),
      question: card.question,
      answer: card.answer,
      groupId: String(card.groupId),
      labels: [],
    }));

    console.log(`Starting exam with ${examFlashcards.length} flashcards`);

    router.push({
      pathname: "/review",
      params: {
        flashcards: JSON.stringify(examFlashcards),
        type: "daily",
      },
    });
  };

  return (
    <ThemedView className="p-4 ">
      <OuterThemedView>
        <ThemedView className="rounded-xl ">
          <ThemedText className="text-lg text-center pt-0">
            Таньд давтах
            <ThemedText className="text-lg font-bold  ">
              {" " + dueFlashcards.length + " "}
            </ThemedText>
            Флашкарт байна
          </ThemedText>
          <Button
            title={loading ? "Ачааллаж байна..." : "Шалгалт өгөх"}
            onPress={handleTodayExam}
            disabled={loading || dueFlashcards.length === 0}
            buttonClass="mt-2 rounded-lg"
          />
        </ThemedView>
      </OuterThemedView>
    </ThemedView>
  );
}
