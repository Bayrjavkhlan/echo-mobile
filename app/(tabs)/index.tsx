import { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "@/components/ProgressBar";
import { ThemedView } from "@/components/ThemedView";
import ActivityBarChart from "@/components/ActivityBarChart";
import { MemorizinStreak } from "@/components/MemorizingStreak";
import WordSuggestion from "@/components/WordSuggestion";
import { useCalendarStore } from "@/store/calendarStore";

export default function HomeScreen() {
  const {
    streak,
    weeklyActivity,
    monthlyActivity,
    weeklyWordsMemorized,
    fetchCalendarData,
    recordAppOpened,
  } = useCalendarStore();

  useEffect(() => {
    const initializeApp = async () => {
      // Record app opened and fetch calendar data on component mount
      await recordAppOpened();
      await fetchCalendarData();
    };

    initializeApp();
  }, [recordAppOpened, fetchCalendarData]);

  // Prepare chart data from calendar store
  const weeklyActivityData = {
    labels: ["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"],
    datasets: [
      {
        data:
          weeklyActivity.length === 7
            ? [
                weeklyActivity[1], // Monday
                weeklyActivity[2], // Tuesday
                weeklyActivity[3], // Wednesday
                weeklyActivity[4], // Thursday
                weeklyActivity[5], // Friday
                weeklyActivity[6], // Saturday
                weeklyActivity[0], // Sunday
              ]
            : [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  // Monthly activity data
  const monthlyActivityData = {
    labels: ["1-7", "8-14", "15-21", "22-28", "29-31"],
    datasets: [
      {
        data: monthlyActivity,
      },
    ],
  };

  // Learned words data
  const learnedWordsData = {
    labels: ["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"],
    datasets: [
      {
        data:
          weeklyWordsMemorized.length === 7
            ? [
                weeklyWordsMemorized[1], // Monday
                weeklyWordsMemorized[2], // Tuesday
                weeklyWordsMemorized[3], // Wednesday
                weeklyWordsMemorized[4], // Thursday
                weeklyWordsMemorized[5], // Friday
                weeklyWordsMemorized[6], // Saturday
                weeklyWordsMemorized[0], // Sunday
              ]
            : [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <ScrollView className="">
          <ThemedView className="flex flex-col h-full">
            <ProgressBar totalWords={123} memorizedWords={86} />
            <WordSuggestion />
            <MemorizinStreak streak={streak} />
            <ActivityBarChart
              weeklyData={weeklyActivityData}
              monthlyData={monthlyActivityData}
              wordsData={learnedWordsData}
              initialActiveDataset="weekly"
            />
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
