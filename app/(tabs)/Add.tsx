import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, ScrollView } from "react-native";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { ThemedView } from "@/components/ThemedView";
import { useColor } from "@/hooks/useThemeColor";
import FlashcardAdd from "@/components/FlashcardAdd";
import { Button } from "@/components/ui/Button";
import Toast from "react-native-toast-message";
import { createManyFlashcards } from "../../db/crud/flashcards";
import { createGroupRecord } from "../../db/crud/group";
import { LabelType, useLabelStore } from "@/store/labelStore";
import {
  addLabelToFlashcard,
  getAllFlashcardLabelsTableData,
} from "../../db/crud/flashcardLabels";
import { SQLiteRunResult } from "expo-sqlite";
import { useGroupStore } from "@/store/groupStore";
import { useRouter } from "expo-router";

export default function AddScreen() {
  const backgroundColor = useColor("background");
  const router = useRouter();
  const addGroup = useGroupStore((state) => state.addGroup);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState(false);

  const [flashcards, setFlashcards] = useState<
    {
      id: number;
      question: string;
      answer: string;
      error: boolean;
      wrongAnswers: string[];
      labels: LabelType[];
    }[]
  >([
    {
      id: Date.now(),
      question: "",
      answer: "",
      error: false,
      wrongAnswers: [],
      labels: [],
    },
  ]);

  const handleAddFlashcard = () => {
    setFlashcards((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: "",
        answer: "",
        wrongAnswers: [],
        error: false,
        labels: [],
      },
    ]);
  };

  const handleDeleteFlashcard = (id: number) => {
    if (flashcards.length === 1) {
      Toast.show({
        type: "error",
        text1: "Анхаар!",
        text2: "Флашкарт багц дор хаяж нэг флашкарттай байх ёстой.",
        visibilityTime: 3000,
        position: "top",
      });
      return;
    }
    setFlashcards((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveFlashcard = async () => {
    let hasError = false;

    if (!title.trim()) {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }

    const newFlashcards = flashcards.map((fc) => {
      if (!fc.question.trim() || !fc.answer.trim()) {
        hasError = true;
        return { ...fc, error: true };
      }
      return { ...fc, error: false };
    });

    setFlashcards(newFlashcards);

    if (hasError) {
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: "Бүх талбарыг бөглөнө үү.",
      });
      return;
    }

    try {
      // 1. Create group
      const groupRes = await createGroupRecord(title, description);
      const groupId = groupRes?.lastInsertRowId;
      console.log("groupId:", groupId);
      if (!groupId) throw new Error("Group ID not returned");

      // 2. Create flashcards
      const flashcardData = flashcards.map((fc) => ({
        question: fc.question.trim(),
        answer: fc.answer.trim(),
        groupId,
      }));
      console.log("flashcardData", flashcardData);

      const flashcardRes: SQLiteRunResult | undefined =
        await createManyFlashcards(flashcardData);
      if (!flashcardRes) {
        throw new Error("Failed to create flashcards");
      }
      const baseFlashcardId =
        flashcardRes.lastInsertRowId - (flashcardData.length - 1);

      // Log the label data before connecting to flashcards
      console.log("About to connect labels to flashcards:");
      flashcards.forEach((fc, idx) => {
        console.log(
          `Flashcard ${idx + 1} has labels:`,
          fc.labels.map((l) => ({ id: l.id, text: l.text }))
        );
      });

      // 3. Connect labels to flashcards
      for (let i = 0; i < flashcardData.length; i++) {
        const flashcardId = baseFlashcardId + i;
        const cardLabels = flashcards[i].labels; // per flashcard

        console.log(
          `Processing labels for flashcard ID ${flashcardId}:`,
          cardLabels.map((l) => `${l.text} (ID: ${l.id})`)
        );

        if (cardLabels && cardLabels.length > 0) {
          for (const label of cardLabels) {
            if (label.id) {
              // Convert the label ID to a number if it's not already one
              const labelId =
                typeof label.id === "string"
                  ? parseInt(label.id, 10)
                  : label.id;

              console.log(
                `Adding label ${labelId} (${label.text}) to flashcard ${flashcardId}`
              );

              await addLabelToFlashcard(flashcardId, labelId);
            } else {
              console.warn(`Skipping label without ID:`, label);
            }
          }
        } else {
          console.log(`No labels to add for flashcard ${flashcardId}`);
        }
      }

      const testResult = await getAllFlashcardLabelsTableData();
      console.log("-------------------------------------------");
      console.log("Flashcard-Label relationships saved:", testResult);
      console.log("-------------------------------------------");

      // 4. Update the groupStore with the new group and flashcards
      const processedFlashcards = flashcards.map((fc, index) => {
        const flashcardId = baseFlashcardId + index;

        // Make sure each label has both name and text properties
        const processedLabels = fc.labels.map((label) => ({
          id: String(label.id),
          name: label.text || "", // Ensure name is always a string
          text: label.text,
        }));

        return {
          id: String(flashcardId),
          question: fc.question.trim(),
          answer: fc.answer.trim(),
          groupId: String(groupId),
          labels: processedLabels,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      console.log(
        "Processed flashcards for group store:",
        processedFlashcards.map((fc) => ({
          id: fc.id,
          labelCount: fc.labels.length,
          labels: fc.labels.map((l) => `${l.id}: ${l.text}`),
        }))
      );

      // Add the new group to the store
      addGroup(
        {
          id: groupId,
          name: title.trim(),
          description: description.trim(),
        },
        processedFlashcards
      );

      Toast.show({
        type: "success",
        text1: "Амжилттай",
        text2: "Флашкарт багц амжилттай хадгалагдлаа.",
      });

      // Reset state
      setTitle("");
      setDescription("");
      setFlashcards([
        {
          id: Date.now(),
          question: "",
          answer: "",
          error: false,
          wrongAnswers: [],
          labels: [],
        },
      ]);

      // Navigate to Library tab to see the newly created group
      router.push("/(tabs)/Library");
    } catch (error) {
      console.error("Error saving flashcard set:", error);
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: "Хадгалах явцад алдаа гарлаа.",
      });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedView className="p-4">
          <Input
            title="Флашкарт багцийн гарчиг"
            value={title}
            onChangeText={setTitle}
            backgroundColor={backgroundColor}
            hasError={titleError}
          />
          <Input
            title="Флашкарт багцийн тайлбар"
            value={description}
            onChangeText={setDescription}
            backgroundColor={backgroundColor}
          />
        </ThemedView>

        {flashcards.map((card, index) => (
          <FlashcardAdd
            key={card.id}
            question={card.question}
            answer={card.answer}
            onChangeQuestion={(text) => {
              const newCards = [...flashcards];
              newCards[index].question = text;
              setFlashcards(newCards);
            }}
            onChangeAnswer={(text) => {
              const newCards = [...flashcards];
              newCards[index].answer = text;
              setFlashcards(newCards);
            }}
            hasError={card.error}
            onDelete={() => handleDeleteFlashcard(card.id)}
            labels={card.labels}
            onChangeLabels={(labels) => {
              const newCards = [...flashcards];
              newCards[index].labels = labels.filter(
                (label): label is LabelType => label.id !== undefined
              );
              setFlashcards(newCards);
            }}
            wrongAnswers={card.wrongAnswers}
            onChangeWrongAnswers={(newAnswers) => {
              const newCards = [...flashcards];
              newCards[index].wrongAnswers = newAnswers;
              setFlashcards(newCards);
            }}
          />
        ))}

        <ThemedView className="p-4 pt-0 flex-1 gap-2">
          <Button
            title="Нэмэх"
            className="w-full"
            onPress={handleAddFlashcard}
          />
          <Button
            title="Хадгалах"
            className="w-full"
            onPress={handleSaveFlashcard}
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
