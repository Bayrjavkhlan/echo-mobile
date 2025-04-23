import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, ScrollView, View } from "react-native";
import GroupFlashcard from "@/components/ui/GroupFlashcard";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HorizontalLabelScroll from "@/components/HorizontalLabelScroll";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type FlashcardGroup = {
  id: string;
  title: string;
  count: number;
  labels: {
    text: string;
    color: string;
  }[];
  description: string;
};

export default function LibraryScreen() {
  const [mockdata] = useState<FlashcardGroup[]>([
    {
      id: "1",
      title: "Biology Basics",
      count: 20,
      labels: [
        { text: "Science", color: "green" },
        { text: "Quiz", color: "blue" },
      ],
      description: "Review fundamental biology concepts and vocabulary.",
    },
    {
      id: "2",
      title: "World History",
      count: 15,
      labels: [
        { text: "History", color: "amber" },
        { text: "Practice", color: "red" },
      ],
      description: "Key historical events from ancient to modern times.",
    },
    {
      id: "3",
      title: "Mathematics",
      count: 30,
      labels: [
        { text: "Math", color: "purple" },
        { text: "Advanced", color: "indigo" },
      ],
      description: "Algebra, calculus, and geometry principles explained.",
    },
    {
      id: "4",
      title: "English Literature",
      count: 25,
      labels: [
        { text: "English", color: "blue" },
        { text: "Books", color: "yellow" },
      ],
      description: "Classic literary works and analysis techniques.",
    },
    {
      id: "5",
      title: "Computer Science",
      count: 40,
      labels: [
        { text: "Tech", color: "cyan" },
        { text: "Coding", color: "emerald" },
      ],
      description: "Programming concepts and algorithm fundamentals.",
    },
    {
      id: "6",
      title: "Psychology",
      count: 35,
      labels: [
        { text: "Science", color: "pink" },
        { text: "Human", color: "rose" },
      ],
      description: "Understanding human behavior and mental processes.",
    },
    {
      id: "7",
      title: "Physics",
      count: 28,
      labels: [
        { text: "Science", color: "green" },
        { text: "Advanced", color: "indigo" },
      ],
      description:
        "Core concepts in mechanics, thermodynamics and quantum physics.",
    },
    {
      id: "8",
      title: "Spanish",
      count: 50,
      labels: [
        { text: "Language", color: "orange" },
        { text: "Beginner", color: "blue" },
      ],
      description:
        "Essential vocabulary and grammar for Spanish language learners.",
    },
  ]);

  const labels: {
    text: string;
    color: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
  }[] = [
    { text: "Нэмэх", color: "slate", icon: "add" },
    { text: "Нэр үг", color: "red" },
    { text: "Үйл үг", color: "orange" },
    { text: "Тоо", color: "amber" },
    { text: "Label 4", color: "yellow" },
    { text: "Label 5", color: "lime" },
    { text: "Label 6", color: "green" },
    { text: "Label 7", color: "emerald" },
    { text: "Label 8", color: "teal" },
    { text: "Label 9", color: "cyan" },
    { text: "Label 10", color: "sky" },
    { text: "Label 11", color: "blue" },
    { text: "Label 12", color: "indigo" },
    { text: "Label 13", color: "violet" },
    { text: "Label 14", color: "purple" },
    { text: "Label 15", color: "rose" },
  ];

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="">
      <ThemedView className="p-4 pb-0">
        <HorizontalLabelScroll labels={labels} />
      </ThemedView>
      <ThemedView>
        <FlatList
          data={mockdata}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GroupFlashcard groupFlashcard={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 220,
          }}
          className="px-4 pt-4 pb-2"
          style={{ padding: 16 }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
