import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, ScrollView, View } from "react-native";
import GroupFlashcard from "@/components/ui/GroupFlashcard";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HorizontalLabelScroll from "@/components/HorizontalLabelScroll";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useGroupStore } from "@/store/groupStore";

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
  // const [mockdata] = useState<FlashcardGroup[]>([
  //   {
  //     id: "1",
  //     title: "Biology Basics",
  //     count: 20,
  //     labels: [
  //       { text: "Science", color: "green" },
  //       { text: "Quiz", color: "blue" },
  //     ],
  //     description: "Review fundamental biology concepts and vocabulary.",
  //   },
  //   {
  //     id: "2",
  //     title: "World History",
  //     count: 15,
  //     labels: [
  //       { text: "History", color: "amber" },
  //       { text: "Practice", color: "red" },
  //     ],
  //     description: "Key historical events from ancient to modern times.",
  //   },
  //   {
  //     id: "3",
  //     title: "Mathematics",
  //     count: 30,
  //     labels: [
  //       { text: "Math", color: "purple" },
  //       { text: "Advanced", color: "indigo" },
  //     ],
  //     description: "Algebra, calculus, and geometry principles explained.",
  //   },
  //   {
  //     id: "4",
  //     title: "English Literature",
  //     count: 25,
  //     labels: [
  //       { text: "English", color: "blue" },
  //       { text: "Books", color: "yellow" },
  //     ],
  //     description: "Classic literary works and analysis techniques.",
  //   },
  //   {
  //     id: "5",
  //     title: "Computer Science",
  //     count: 40,
  //     labels: [
  //       { text: "Tech", color: "cyan" },
  //       { text: "Coding", color: "emerald" },
  //     ],
  //     description: "Programming concepts and algorithm fundamentals.",
  //   },
  //   {
  //     id: "6",
  //     title: "Psychology",
  //     count: 35,
  //     labels: [
  //       { text: "Science", color: "pink" },
  //       { text: "Human", color: "rose" },
  //     ],
  //     description: "Understanding human behavior and mental processes.",
  //   },
  //   {
  //     id: "7",
  //     title: "Physics",
  //     count: 28,
  //     labels: [
  //       { text: "Science", color: "green" },
  //       { text: "Advanced", color: "indigo" },
  //     ],
  //     description:
  //       "Core concepts in mechanics, thermodynamics and quantum physics.",
  //   },
  //   {
  //     id: "8",
  //     title: "Spanish",
  //     count: 50,
  //     labels: [
  //       { text: "Language", color: "orange" },
  //       { text: "Beginner", color: "blue" },
  //     ],
  //     description:
  //       "Essential vocabulary and grammar for Spanish language learners.",
  //   },
  // ]);

  const { groups, fetchGroups } = useGroupStore();
  useEffect(() => {
    fetchGroups();
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="">
      <ThemedView className="p-4 pb-0">
        <HorizontalLabelScroll />
      </ThemedView>
      <ThemedView>
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GroupFlashcard
              groupFlashcard={item}
              count={item.flashcards.length}
            />
          )}
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
