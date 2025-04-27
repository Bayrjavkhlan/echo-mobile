import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, ScrollView } from "react-native";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { OuterThemedView } from "@/components/OuterThemedView";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import HorizontalLabelScroll from "@/components/HorizontalLabelScroll";
import FlashcardAdd from "@/components/FlashcardAdd";
import { Button } from "@/components/ui/Button";
import Toast from "react-native-toast-message";

export default function AddScreen() {
  const backgroundColor = useThemeColor({}, "background");

  const [flashcards, setFlashcards] = useState<number[]>([Date.now()]); // list of flashcard ids

  // add a new flashcard
  const handleAddFlashcard = () => {
    setFlashcards((prev) => [...prev, Date.now()]);
  };

  // delete a flashcard
  const handleDeleteFlashcard = (id: number) => {
    if (flashcards.length === 1) {
      // Cannot delete the last one
      // Alert.alert(
      //   "Анхааруулга",
      //   "Флашкарт багц дор хаяж нэг флашкарттай байх ёстой.",
      //   [{ text: "Ойлголоо", style: "cancel" }]
      // );

      Toast.show({
        type: "error",
        text1: "Анхаар!",
        text2: "Флашкарт багц дор хаяж нэг флашкарттай байх ёстой.",
        visibilityTime: 3000,
        position: "top",
      });
      return;
    }
    setFlashcards((prev) => prev.filter((item) => item !== id));
  };

  const handleSaveFlashcard = () => {
    console.log("Save button pressed");
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedView className="p-4">
          <Input
            title="Флашкарт багцийн гарчиг"
            className="mb-2"
            backgroundColor={backgroundColor}
          />
        </ThemedView>

        {/* render all flashcards */}
        {flashcards.map((id) => (
          <FlashcardAdd key={id} onDelete={() => handleDeleteFlashcard(id)} />
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
