import HorizontalLabelScroll from "@/components/HorizontalLabelScroll";
import StackCards from "@/components/StackCards";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { useEffect, useState } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useFlashcards } from "@/app/hook/useFlashcards";
import { ProgressBar } from "@/components/ProgressBar";
import LabelAdd from "@/components/LabelAdd";
import { ThemedView } from "@/components/ThemedView";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Progress } from "@/components/ui/Progress";
import ActivityBarChart from "@/components/ActivityBarChart";
import { MemorizinStreak } from "@/components/MemorizingStreak";
// const labels = [
//   { id: 1, name: "Home", icon: "home" },
//   { id: 2, name: "Profile", icon: "user" },
//   { id: 3, name: "Settings", icon: "settings" },
//   { id: 4, name: "Messages", icon: "message-circle" },
//   { id: 5, name: "Notifications", icon: "bell" },
//   { id: 6, name: "Favorites", icon: "heart" },
//   { id: 7, name: "Search", icon: "search" },
//   { id: 8, name: "Camera", icon: "camera" },
//   { id: 9, name: "Music", icon: "music" },
//   { id: 10, name: "Weather", icon: "cloud" },
// ];

const { width: screenWidth } = Dimensions.get("window");

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

const labelData = {
  text: "Боловсрол",
  color: "blue",
};

// Updated data for user spending hours across the week
const weeklyActivityData = {
  labels: ["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"],
  datasets: [
    {
      data: [2.5, 3.7, 1.8, 4.2, 3.0, 5.5, 2.3],
    },
  ],
};

// Monthly activity data
const monthlyActivityData = {
  labels: ["1-7", "8-14", "15-21", "22-28", "29-31"],
  datasets: [
    {
      data: [18.5, 22.3, 19.8, 25.2, 14.7],
    },
  ],
};

// Learned words data
const learnedWordsData = {
  labels: ["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"],
  datasets: [
    {
      data: [12, 23, 8, 15, 19, 27, 10],
    },
  ],
};

export default function HomeScreen() {
  const [activeDataset, setActiveDataset] = useState<
    "weekly" | "monthly" | "words"
  >("weekly");

  // Function to get the current dataset based on the activeDataset state
  const getCurrentData = () => {
    switch (activeDataset) {
      case "weekly":
        return {
          data: weeklyActivityData,
          suffix: " цаг",
          title: "Апп ашиглалтын цаг (7 хоног)",
        };
      case "monthly":
        return {
          data: monthlyActivityData,
          suffix: " цаг",
          title: "Апп ашиглалтын цаг (Сар)",
        };
      case "words":
        return {
          data: learnedWordsData,
          suffix: " үг",
          title: "Сурсан үгсийн тоо",
        };
      default:
        return {
          data: weeklyActivityData,
          suffix: " цаг",
          title: "Апп ашиглалтын цаг (7 хоног)",
        };
    }
  };

  const currentData = getCurrentData();

  // const {
  //   flashcards,
  //   loading,
  //   error,
  //   fetchFlashcards,
  //   createFlashcard,
  //   updateFlashcard,
  //   deleteFlashcard,
  // } = useFlashcards();

  // useEffect(() => {
  //   fetchFlashcards();
  // }, [fetchFlashcards]);

  // if (loading) {
  //   return (
  //     <SafeAreaView className="bg-white dark:bg-gray-900">
  //       <ThemedText>Loading flashcards...</ThemedText>
  //     </SafeAreaView>
  //   );
  // }

  // if (error) {
  //   return (
  //     <SafeAreaView className="bg-white dark:bg-gray-900">
  //       <ThemedText>Error: {error}</ThemedText>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView className="">
      <ScrollView className="">
        <ThemedView className="flex flex-col h-full">
          <ProgressBar totalWords={123} memorizedWords={86} />
          <Label data={labelData} onPress={() => console.log("pressed")} />
          <HorizontalLabelScroll labels={labels} />
          <LabelAdd />
          <Progress percentage={12} />
          <ActivityBarChart
            weeklyData={weeklyActivityData}
            monthlyData={monthlyActivityData}
            wordsData={learnedWordsData}
            initialActiveDataset="weekly"
          />
          <MemorizinStreak streak={5} />
        </ThemedView>
      </ScrollView>

      {/* <LabelAdd data={labelData} />
        <Label data={labelData} /> */}
      {/* </ThemedView> */}

      {/* <ThemedText>гэр</ThemedText>
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
      /> */}
    </SafeAreaView>
  );
}
