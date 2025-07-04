import React, { useState, useEffect, useCallback } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/Button";
import { Flashcard as FlashcardType } from "@/store/flashcardStore";
import { useColor } from "@/hooks/useThemeColor";
import { OuterThemedView } from "./OuterThemedView";
import { getCountOfWrongAnswerByFlashcardId } from "@/db/crud/wrongAnswers";

type FlashcardExamProps = {
  flashcards: FlashcardType[];
  onComplete?: (results: ExamResult[]) => void;
};

type ExamResult = {
  flashcardId: string;
  correct: boolean;
  timeToAnswer: number;
  userAnswer: string;
};

export default function FlashcardExam({
  flashcards = [],
  onComplete,
}: FlashcardExamProps) {
  const [shuffledFlashcards, setShuffledFlashcards] = useState<FlashcardType[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const redColor = useColor("red");
  const blueColor = useColor("blue");
  const yellowColor = useColor("yellow");
  const greenColor = useColor("green");
  const contentBackground = useColor("contentBackground");
  const screenHeight = Dimensions.get("window").height;
  console.log("First groupId:", shuffledFlashcards[0]?.groupId);
  // Shuffle flashcards when they change
  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      // Create a copy of the flashcards and shuffle them
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setShuffledFlashcards(shuffled);
      // Reset current index when flashcards change
      setCurrentIndex(0);
      // Reset results
      setResults([]);
    }
  }, [flashcards]);

  const currentFlashcard = shuffledFlashcards[currentIndex];
  const wrongAnswerCount = async (groupId: number) => {
    const count = await getCountOfWrongAnswerByFlashcardId(groupId);
    return count;
  };

  const getWrongAnswers = useCallback(() => {
    if (!currentFlashcard || !currentFlashcard.wrongAnswers) {
      return ["", "", ""];
    }

    const wrongs = [...currentFlashcard.wrongAnswers];
    const shuffled = wrongs.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    return [
      selected[0]?.text || "",
      selected[1]?.text || "",
      selected[2]?.text || "",
    ];
  }, [currentFlashcard]);

  const getShuffledAnswers = useCallback(() => {
    if (!currentFlashcard) return [];

    const wrongAnswers = getWrongAnswers();
    const allAnswers = [...wrongAnswers, currentFlashcard.answer];

    return allAnswers.sort(() => Math.random() - 0.5);
  }, [currentFlashcard, getWrongAnswers]);

  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    setTimer(0);

    if (timerInterval) {
      clearInterval(timerInterval);
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    setTimerInterval(interval);

    setShuffledAnswers(getShuffledAnswers());

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentIndex, getShuffledAnswers]);

  const handleAnswer = (answer: string) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    if (!currentFlashcard || !currentFlashcard.id || !currentFlashcard.answer) {
      console.log("Cannot process answer: Invalid or missing flashcard data");
      return;
    }

    const isCorrect = answer === currentFlashcard.answer;

    const newResult: ExamResult = {
      flashcardId: currentFlashcard.id,
      correct: isCorrect,
      timeToAnswer: timer,
      userAnswer: answer,
    };

    setResults((prevResults) => [...prevResults, newResult]);

    if (currentIndex < shuffledFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (onComplete) {
        const finalResults = [...results, newResult];

        const validResults = finalResults.filter(
          (result) =>
            result &&
            result.flashcardId &&
            typeof result.flashcardId === "string"
        );

        if (validResults.length !== finalResults.length) {
          console.warn(
            `Filtered out ${
              finalResults.length - validResults.length
            } invalid results`
          );
        }

        onComplete(validResults);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!currentFlashcard) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>No flashcards available</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <ThemedView className="items-center justify-center pb-2">
        <ThemedText className="text-lg font-bold">
          {formatTime(timer)}
        </ThemedText>
      </ThemedView>

      <ThemedView
        className="rounded-xl items-center justify-center p-4"
        style={{ height: screenHeight * 0.7 * 0.8 }}
        customBackgroundColor={contentBackground}
      >
        <ThemedText className="text-2xl  text-center">
          {currentFlashcard.question}
        </ThemedText>
        <View style={styles.indexIndicator}>
          <ThemedText className="text-xs">
            {currentIndex + 1} / {shuffledFlashcards.length}
          </ThemedText>
        </View>
      </ThemedView>
      <ThemedView className="pt-4" style={{ height: screenHeight * 0.3 * 0.8 }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={{ flex: 1, flexDirection: "row", marginBottom: 8 }}>
            <View style={{ flex: 1, marginRight: 4 }}>
              <Button
                title={shuffledAnswers[0] || ""}
                onPress={() => handleAnswer(shuffledAnswers[0] || "")}
                color={redColor}
                size="large"
                buttonClass="h-full justify-center"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 4 }}>
              <Button
                title={shuffledAnswers[1] || ""}
                onPress={() => handleAnswer(shuffledAnswers[1] || "")}
                color={blueColor}
                size="large"
                buttonClass="h-full justify-center"
              />
            </View>
          </View>

          <View style={{ flex: 1, flexDirection: "row", marginTop: 8 }}>
            <View style={{ flex: 1, marginRight: 4 }}>
              <Button
                title={shuffledAnswers[2] || ""}
                onPress={() => handleAnswer(shuffledAnswers[2] || "")}
                color={greenColor}
                size="large"
                buttonClass="h-full justify-center"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 4 }}>
              <Button
                title={shuffledAnswers[3] || ""}
                onPress={() => handleAnswer(shuffledAnswers[3] || "")}
                color={yellowColor}
                size="large"
                buttonClass="h-full justify-center"
              />
            </View>
          </View>
        </View>
      </ThemedView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  indexIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
