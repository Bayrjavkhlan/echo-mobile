import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, ScrollView } from "react-native";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { OuterThemedView } from "@/components/OuterThemedView";
import { ThemedView } from "@/components/ThemedView";
import { useColor } from "@/hooks/useThemeColor";
import HorizontalLabelScroll from "@/components/HorizontalLabelScroll";
import FlashcardAdd from "@/components/FlashcardAdd";
import { Button } from "@/components/ui/Button";
import Toast from "react-native-toast-message";

export default function AddScreen() {
  const backgroundColor = useColor("background");

  const [title, setTitle] = useState("");
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

  const handleSaveFlashcard = () => {
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

    console.log("All fields are filled. Proceed to save...");
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedView className="p-4">
          <Input
            // className="mb-2"
            title="Флашкарт багцийн гарчиг"
            value={title}
            onChangeText={setTitle}
            backgroundColor={backgroundColor}
            hasError={titleError}
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
