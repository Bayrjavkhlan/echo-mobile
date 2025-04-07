import HorizontalLabelScroll from "@/components/HorizontalLabelScroll";
import StackCards from "@/components/StackCards";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useFlashcards } from "@/app/hook/useFlashcards";

const labels = [
  { id: 1, name: "Home", icon: "home" },
  { id: 2, name: "Profile", icon: "user" },
  { id: 3, name: "Settings", icon: "settings" },
  { id: 4, name: "Messages", icon: "message-circle" },
  { id: 5, name: "Notifications", icon: "bell" },
  { id: 6, name: "Favorites", icon: "heart" },
  { id: 7, name: "Search", icon: "search" },
  { id: 8, name: "Camera", icon: "camera" },
  { id: 9, name: "Music", icon: "music" },
  { id: 10, name: "Weather", icon: "cloud" },
];

const labelData = {
  text: "Боловсрол",
  color: "blue",
};

export default function HomeScreen() {
  const {
    flashcards,
    loading,
    error,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
  } = useFlashcards();

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  if (loading) {
    return (
      <SafeAreaView className="bg-white dark:bg-gray-900">
        <ThemedText>Loading flashcards...</ThemedText>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-white dark:bg-gray-900">
        <ThemedText>Error: {error}</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white dark:bg-gray-900">
      <ThemedText>гэр</ThemedText>
      <Label data={labelData}></Label>
      <HorizontalLabelScroll />
      <ThemedText>test</ThemedText>
      <View style={tw`p-4`}>
        <ThemedText>This should be NotoSerif</ThemedText>
        <Label data={{ text: "Test Label", color: "blue" }} />
      </View>
      <Button title="test123456789" />
      <ThemedText>test</ThemedText>
      <Button
        title="Submit"
        type="contained"
        size="large"
        onPress={() => console.log("Pressed")}
        rightIcon="add"
      />
      <Button title="Delete" type="outlined" color="danger" />
      <Button
        title="Learn More"
        type="text"
        buttonClass="p-0"
        textClass="underline"
      />
      <Button type="icon" color="secondary" />
      <Button title="Processing..." loading disabled />
      {/* <StackCards /> */}

      <ScrollView>
        {flashcards.map((flashcard) => (
          <View key={flashcard.id} style={tw`p-4 border-b border-gray-200`}>
            <ThemedText className="text-lg">
              {flashcard.question_type}
            </ThemedText>
            <ThemedText>{flashcard.answer}</ThemedText>
            <Label data={{ text: flashcard.label, color: "blue" }} />

            <View style={tw`flex-row mt-2`}>
              <Button
                title="Edit"
                type="outlined"
                onPress={() => {
                  updateFlashcard(flashcard.id, {
                    question_type: flashcard.question_type,
                    question: "Updated question",
                    answer: flashcard.answer,
                    label: flashcard.label,
                    description: flashcard.description,
                    label_ids: [],
                  });
                }}
              />
              <Button
                title="Delete"
                type="outlined"
                color="danger"
                onPress={() => deleteFlashcard(flashcard.id)}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <Button
        title="Add Flashcard"
        type="contained"
        onPress={() => {
          createFlashcard({
            group_id: 1,
            question_type: "New Question",
            question: "What is...?",
            answer: "The answer is...",
            label: "New Label",
            description: "Description here",
            label_ids: [],
          });
        }}
      />
    </SafeAreaView>
  );
}
