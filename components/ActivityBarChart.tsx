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
  const [activeDataset, setActiveDataset] = useState<
    "weekly" | "monthly" | "words"
  >(initialActiveDataset);

  // Get data from the calendar store
  const {
    weeklyActivity,
    monthlyActivity,
    weeklyWordsMemorized,
    fetchWeeklyActivityData,
    fetchMonthlyActivityData,
    fetchWeeklyWordsMemorizedData,
  } = useCalendarStore();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all chart data
      await Promise.all([
        fetchWeeklyActivityData(),
        fetchMonthlyActivityData(),
        fetchWeeklyWordsMemorizedData(),
      ]);
    };

    fetchData();
  }, [
    fetchWeeklyActivityData,
    fetchMonthlyActivityData,
    fetchWeeklyWordsMemorizedData,
  ]);

  // Prepare data objects from store data
  const storeWeeklyData: ChartData = {
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

  const storeMonthlyData: ChartData = {
    labels: ["1-7", "8-14", "15-21", "22-28", "29-31"],
    datasets: [{ data: monthlyActivity }],
  };

  const storeWordsData: ChartData = {
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
    labels: ["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  };

  const defaultMonthlyData = {
    labels: ["1-7", "8-14", "15-21", "22-28", "29-31"],
    datasets: [{ data: [0, 0, 0, 0, 0] }],
  };

  const defaultWordsData = {
    labels: ["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  };

  console.log("weeklyActivity", weeklyActivity);
  console.log("monthlyActivity", monthlyActivity);

  // Use props if provided, otherwise use store data, and fall back to defaults if needed
  const finalWeeklyData =
    propWeeklyData ||
    (weeklyActivity.some((val) => val > 0)
      ? storeWeeklyData
      : defaultWeeklyData);

  const finalMonthlyData =
    propMonthlyData ||
    (monthlyActivity.some((val) => val > 0)
      ? storeMonthlyData
      : defaultMonthlyData);

  const finalWordsData =
    propWordsData ||
    (weeklyWordsMemorized.some((val) => val > 0)
      ? storeWordsData
      : defaultWordsData);

  // Function to get the current dataset based on the activeDataset state
  const getCurrentData = () => {
    switch (activeDataset) {
      case "weekly":
        return {
          data: finalWeeklyData,
          suffix: " цаг",
          title: "Апп ашиглалтын цаг (7 хоног)",
        };
      case "monthly":
        return {
          data: finalMonthlyData,
          suffix: " цаг",
          title: "Апп ашиглалтын цаг (Сар)",
        };
      case "words":
        return {
          data: finalWordsData,
          suffix: " үг",
          title: "Сурсан үгсийн тоо",
        };
      default:
        return {
          data: finalWeeklyData,
          suffix: " цаг",
          title: "Апп ашиглалтын цаг (7 хоног)",
        };
    }
  };

  const currentData = getCurrentData();

  const backgroundColor = useColor("background");
  const textColor = useColor("text");

  return (
    <View className="p-4">
      <ThemedText className="text-lg font-bold mb-4 text-center">
        {currentData.title}
      </ThemedText>
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

      <ThemedView className="flex flex-row justify-center items-center gap-4 px-4">
        <Button
          title="7 хоног"
          buttonClass="flex-1"
          onPress={() => setActiveDataset("weekly")}
        />

        <Button
          title="Сар"
          buttonClass="flex-1"
          onPress={() => setActiveDataset("monthly")}
        />

        <Button
          title="Үгс"
          buttonClass="flex-1"
          onPress={() => setActiveDataset("words")}
        />
      </ThemedView>
    </View>
  );
}
