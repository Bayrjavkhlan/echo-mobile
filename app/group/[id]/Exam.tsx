import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import FlashcardExam from "@/components/FlashcardExam";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native";
import { useGroupStore } from "@/store/groupStore";
import { Flashcard } from "@/store/flashcardStore";
import { ExamResultItem } from "./ExamEnd";

export default function GroupsExamScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const [groupFlashcards, setGroupFlashcards] = useState<Flashcard[]>([]);
  const { fetchGroupById, currentGroup } = useGroupStore();

  useEffect(() => {
    if (id) {
      fetchGroupById(id);
    }
  }, [id, fetchGroupById]);

  useEffect(() => {
    if (currentGroup) {
      setGroupFlashcards(currentGroup.flashcards);
    }
  }, [currentGroup]);

  const handleExamComplete = (results: ExamResultItem[]) => {
    console.log("Exam completed with results:", results);

    // Get group name from params or current group
    const groupName = name || currentGroup?.title || "";
    console.log("Passing group name to ExamEnd:", groupName);

    // Navigate to the exam results page with the results data and group name
    router.push({
      pathname: "/group/[id]/ExamEnd",
      params: {
        id: id,
        name: groupName,
        results: JSON.stringify(results),
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1 p-4">
        <FlashcardExam
          flashcards={groupFlashcards}
          onComplete={handleExamComplete}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
