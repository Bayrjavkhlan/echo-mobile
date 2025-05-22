import { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "@/components/ProgressBar";
import { ThemedView } from "@/components/ThemedView";
import ActivityBarChart from "@/components/ActivityBarChart";
import { MemorizinStreak } from "@/components/MemorizingStreak";
import WordSuggestion from "@/components/WordSuggestion";
import { useCalendarStore } from "@/store/calendarStore";
import { getFlashcardStats } from "@/db/crud/flashcards";

export default function HomeScreen() {
  const {
    streak,
    weeklyActivity,
    monthlyActivity,
    weeklyWordsMemorized,
    fetchCalendarData,
    recordAppOpened,
  } = useCalendarStore();
  const calendarFetch = useCalendarStore((state) => state.fetchCalendarData);
  const [totalWords, setTotalWords] = useState(0);
  const [memorizedWords, setMemorizedWords] = useState(0);

  useEffect(() => {
    const initializeApp = async () => {
      await recordAppOpened();
      await fetchCalendarData();
      await calendarFetch();
    };

    initializeApp();
  }, [recordAppOpened, fetchCalendarData]);

  const weeklyActivityData = {
    labels: ["Ням", "Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям"],
    datasets: [
      {
        data:
          weeklyActivity.length === 7
            ? [
                weeklyActivity[0], // Sunday
                weeklyActivity[1], // Monday
                weeklyActivity[2], // Tuesday
                weeklyActivity[3], // Wednesday
                weeklyActivity[4], // Thursday
                weeklyActivity[5], // Friday
                weeklyActivity[6], // Saturday
              ]
            : [1, 2, 3, 4, 5, 6, 7],
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
    labels: ["Ням", "Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям"],
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

  useEffect(() => {
    const loadProgress = async () => {
      const data = await getFlashcardStats();
      if (data) {
        console.log("EF > 2.6:", data.efAbove2_6);
        console.log("Total flashcards:", data.total);
        setTotalWords(data.total);
        setMemorizedWords(data.efAbove2_6);
      }
    };
    loadProgress();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <ScrollView className="">
          <ThemedView className="flex flex-col h-full pb-4">
            <ProgressBar
              totalWords={totalWords}
              memorizedWords={memorizedWords}
            />
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
