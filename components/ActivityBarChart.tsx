import React, { useState, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/Button";
import { Colors } from "@/constants/Colors";
import { useColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { useCalendarStore } from "@/store/calendarStore";

const { width: screenWidth } = Dimensions.get("window");

// Types for chart data
interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

// Component props
interface ActivityBarChartProps {
  weeklyData?: ChartData;
  monthlyData?: ChartData;
  wordsData?: ChartData;
  initialActiveDataset?: "weekly" | "monthly" | "words";
}

export default function ActivityBarChart({
  weeklyData: propWeeklyData,
  monthlyData: propMonthlyData,
  wordsData: propWordsData,
  initialActiveDataset = "weekly",
}: ActivityBarChartProps) {
  // New state for data type and period
  const [dataType, setDataType] = useState<"time" | "words">("time");
  const [period, setPeriod] = useState<"today" | "weekly" | "monthly">(
    "weekly"
  );

  // Get data from the calendar store
  const {
    entries,
    weeklyActivity,
    monthlyActivity,
    weeklyWordsMemorized,
    fetchWeeklyActivityData,
    fetchMonthlyActivityData,
    fetchWeeklyWordsMemorizedData,
    fetchCalendarData,
  } = useCalendarStore();

  useEffect(() => {
    // Fetch all chart data
    fetchCalendarData();
  }, [fetchCalendarData]);

  // Helper to get today's date string
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Compute today's data from entries
  const todayEntry = entries.find((e) => e.date === getTodayString());
  const todayTime = todayEntry?.minutesSpent ?? 0;
  const todayWords = todayEntry?.wordsMemorized ?? 0;

  // Prepare data objects from store data
  const storeWeeklyTimeData: ChartData = {
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

  const storeMonthlyTimeData: ChartData = {
    labels: ["1-7", "8-14", "15-21", "22-28", "29-31"],
    datasets: [{ data: monthlyActivity }],
  };

  const storeWeeklyWordsData: ChartData = {
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

  // Default data if neither props nor store data is available
  const defaultWeeklyData = {
    labels: ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  };

  const defaultMonthlyData = {
    labels: ["1-7", "8-14", "15-21", "22-28", "29-31"],
    datasets: [{ data: [0, 0, 0, 0, 0] }],
  };

  const defaultWordsData = {
    labels: ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  };

  // Use props if provided, otherwise use store data, and fall back to defaults if needed
  const finalWeeklyTimeData =
    propWeeklyData ||
    (weeklyActivity.some((val) => val > 0)
      ? storeWeeklyTimeData
      : defaultWeeklyData);

  const finalMonthlyTimeData =
    propMonthlyData ||
    (monthlyActivity.some((val) => val > 0)
      ? storeMonthlyTimeData
      : defaultMonthlyData);

  const finalWeeklyWordsData =
    propWordsData ||
    (weeklyWordsMemorized.some((val) => val > 0)
      ? storeWeeklyWordsData
      : defaultWordsData);

  // Function to get the current dataset based on the state
  const getCurrentData = () => {
    if (dataType === "time") {
      if (period === "today") {
        return {
          data: {
            labels: ["Өнөөдөр"],
            datasets: [{ data: [todayTime] }],
          },
          suffix: " цаг",
        };
      } else if (period === "weekly") {
        return {
          data: finalWeeklyTimeData,
          suffix: " цаг",
        };
      } else {
        return {
          data: finalMonthlyTimeData,
          suffix: " цаг",
        };
      }
    } else {
      if (period === "today") {
        return {
          data: {
            labels: ["Өнөөдөр"],
            datasets: [{ data: [todayWords] }],
          },
          suffix: " үг",
        };
      } else if (period === "weekly") {
        return {
          data: finalWeeklyWordsData,
          suffix: " үг",
        };
      } else {
        return {
          data: finalWeeklyWordsData,
          suffix: " үг",
        };
      }
    }
  };

  const currentData = getCurrentData();
  const backgroundColor = useColor("background");
  const textColor = useColor("text");

  return (
    <View className="p-4">
      {/* Top buttons */}
      <ThemedView className="flex flex-row justify-center items-center gap-4 mt-4 px-4">
        <Button
          title="цаг"
          buttonClass={`flex-1 ${dataType === "time" ? "bg-indigo-500" : ""}`}
          onPress={() => setDataType("time")}
        />
        <Button
          title="үг"
          buttonClass={`flex-1 ${dataType === "words" ? "bg-indigo-500" : ""}`}
          onPress={() => setDataType("words")}
        />
      </ThemedView>

      <ThemedView style={{ padding: 16 }}>
        <BarChart
          data={currentData.data}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix={currentData.suffix}
          chartConfig={{
            backgroundColor: `${backgroundColor}`,
            backgroundGradientFrom: `${backgroundColor}`,
            backgroundGradientTo: `${backgroundColor}`,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(71, 85, 205, ${opacity})`,
            labelColor: () => `${textColor}`,
            barPercentage: 0.6,
          }}
          style={{ borderRadius: 12 }}
          fromZero
        />
      </ThemedView>

      {/* Bottom buttons */}
      <ThemedView className="flex flex-row justify-center items-center gap-4 px-4 pt-0">
        <Button
          title="өнөөдөр"
          buttonClass={`flex-1 ${period === "today" ? "bg-indigo-500" : ""}`}
          onPress={() => setPeriod("today")}
        />
        <Button
          title="7 хоног"
          buttonClass={`flex-1 ${period === "weekly" ? "bg-indigo-500" : ""}`}
          onPress={() => setPeriod("weekly")}
        />
        <Button
          title="сар"
          buttonClass={`flex-1 ${period === "monthly" ? "bg-indigo-500" : ""}`}
          onPress={() => setPeriod("monthly")}
        />
      </ThemedView>
    </View>
  );
}
