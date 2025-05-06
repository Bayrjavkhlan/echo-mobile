import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/Button";
import { Colors } from "@/constants/Colors";
import { useColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";

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
  weeklyData = {
    labels: ["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"],
    datasets: [{ data: [1, 2, 1.8, 4.2, 3.0, 7.5, 2.3] }],
  },
  monthlyData = {
    labels: ["1-7", "8-14", "15-21", "22-28", "29-31"],
    datasets: [{ data: [18.5, 22.3, 19.8, 25.2, 14.7] }],
  },
  wordsData = {
    labels: ["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"],
    datasets: [{ data: [12, 23, 8, 15, 19, 27, 10] }],
  },
  initialActiveDataset = "weekly",
}: ActivityBarChartProps) {
  const [activeDataset, setActiveDataset] = useState<
    "weekly" | "monthly" | "words"
  >(initialActiveDataset);

  // Function to get the current dataset based on the activeDataset state
  const getCurrentData = () => {
    switch (activeDataset) {
      case "weekly":
        return {
          data: weeklyData,
          suffix: " цаг",
          title: "Апп ашиглалтын цаг (7 хоног)",
        };
      case "monthly":
        return {
          data: monthlyData,
          suffix: " цаг",
          title: "Апп ашиглалтын цаг (Сар)",
        };
      case "words":
        return {
          data: wordsData,
          suffix: " үг",
          title: "Сурсан үгсийн тоо",
        };
      default:
        return {
          data: weeklyData,
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
          // type={activeDataset === "weekly" ? "contained" : "outlined"}
          // color={activeDataset === "weekly" ? "primary" : "secondary"}
          buttonClass="flex-1"
          onPress={() => setActiveDataset("weekly")}
        />

        <Button
          title="Сар"
          // type={activeDataset === "monthly" ? "contained" : "outlined"}
          // color={activeDataset === "monthly" ? "primary" : "secondary"}
          buttonClass="flex-1"
          onPress={() => setActiveDataset("monthly")}
        />

        <Button
          title="Үгс"
          // type={activeDataset === "words" ? "contained" : "outlined"}
          // color={activeDataset === "words" ? "primary" : "secondary"}
          buttonClass="flex-1"
          onPress={() => setActiveDataset("words")}
        />
      </ThemedView>
    </View>
  );
}
