import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, ScrollView } from "react-native";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { ThemedView } from "@/components/ThemedView";
import { useColor } from "@/hooks/useThemeColor";
import FlashcardAdd from "@/components/FlashcardAdd";
import { Button } from "@/components/ui/Button";
import Toast from "react-native-toast-message";
import { createManyFlashcards } from "../db/crud/flashcards";
import { createGroupRecord } from "../db/crud/group";
import { LabelType, useLabelStore } from "@/store/labelStore";
import {
  addLabelToFlashcard,
  getAllFlashcardLabelsTableData,
} from "../db/crud/flashcardLabels";
import { SQLiteRunResult } from "expo-sqlite";

export default function AddScreen() {
  const backgroundColor = useColor("background");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState(false);

  const [flashcards, setFlashcards] = useState<
    { id: number; question: string; answer: string; error: boolean }[]
  >([{ id: Date.now(), question: "", answer: "", error: false }]);

  const handleAddFlashcard = () => {
    setFlashcards((prev) => [
      ...prev,
      { id: Date.now(), question: "", answer: "", error: false },
    ]);
  };
  const testResult = getAllFlashcardLabelsTableData();
  console.log("-------------------------------------------");
  console.log("ene dda label hadgalku bgan bishu:\t", testResult);
  console.log("-------------------------------------------");
  console.log("-------------------------------------------");
  console.log("-------------------------------------------");
  console.log("-------------------------------------------");

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
      const groupRes: SQLiteRunResult | undefined = await createGroupRecord(
        title,
        description
      );
      const groupId = groupRes?.lastInsertRowId;

      if (!groupId) throw new Error("Group ID not returned");

      // 2. Create flashcards
      const flashcardData = flashcards.map((fc) => ({
        question: fc.question.trim(),
        answer: fc.answer.trim(),
        groupId,
      }));

      const flashcardRes: SQLiteRunResult | undefined =
        await createManyFlashcards(flashcardData);
      const baseFlashcardId = flashcardRes?.lastInsertRowId;

      // 3. Connect labels to flashcards
      const labels: LabelType[] = useLabelStore.getState().labels;

      if (labels.length > 0 && baseFlashcardId != null) {
        for (let i = 0; i < flashcardData.length; i++) {
          const flashcardId = baseFlashcardId + i;
          for (const label of labels) {
            const labelId = (label as any).id;
            if (labelId) {
              await addLabelToFlashcard(flashcardId, labelId);
            }
          }
        }
      }

      const testResult = getAllFlashcardLabelsTableData();
      console.log("-------------------------------------------");
      console.log("ene dda label hadgalku bgan bishu:\t", testResult);
      console.log("-------------------------------------------");
      console.log("-------------------------------------------");
      console.log("-------------------------------------------");
      console.log("-------------------------------------------");

      Toast.show({
        type: "success",
        text1: "Амжилттай",
        text2: "Флашкарт багц амжилттай хадгалагдлаа.",
      });

      // Reset state
      setTitle("");
      setDescription("");
      setFlashcards([
        { id: Date.now(), question: "", answer: "", error: false },
      ]);
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
