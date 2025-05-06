import { Image } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useEffect, useState } from "react";
import { OuterThemedView } from "./OuterThemedView";
import { useCalendarStore } from "@/store/calendarStore";

interface MemorizinStreakProps {
  streak?: number;
}

const days = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];

export const MemorizinStreak: React.FC<MemorizinStreakProps> = (props) => {
  const { streak: propStreak } = props;
  const [weekDates, setWeekDates] = useState<number[]>([]);
  const today = new Date();

  // Use the calendar store to get the streak
  const {
    streak: storeStreak,
    fetchStreak,
    recordAppOpened,
  } = useCalendarStore();

  // Determine which streak to use - prop has priority if provided
  const streak = propStreak !== undefined ? propStreak : storeStreak;

  useEffect(() => {
    const initialize = async () => {
      // Record app opened when component mounts
      await recordAppOpened();

      // If streak is not provided as a prop, fetch it from the store
      if (propStreak === undefined) {
        await fetchStreak();
      }
    };

    initialize();
  }, [propStreak, fetchStreak, recordAppOpened]);

  useEffect(() => {
    const todayDay = today.getDay();
    const dates: number[] = [];
    const currentDate = new Date(today);

    currentDate.setDate(today.getDate() - todayDay);

    for (let i = 0; i < 7; i++) {
      dates.push(currentDate.getDate());
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setWeekDates(dates);
  }, []);

  return (
    <ThemedView className="flex-1 p-4 pb-2">
      <OuterThemedView>
        <ThemedText className="text-center text-lg">
          Та <ThemedText className="text-xl font-bold">{streak}</ThemedText>{" "}
          хоног тасралтгүй өөрийгөө хөгжүүллээ
        </ThemedText>
        <ThemedView className="items-center justify-center relative">
          <Image
            source={require("@/assets/images/fire.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
            accessibilityLabel="fire icon"
          />
          <ThemedText
            className="absolute text-orange-700 font-bold text-lg top-17"
            style={{
              textShadowColor: "#eab308",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            {streak}
          </ThemedText>
        </ThemedView>
        <ThemedView className="flex-row justify-between mt-4 px-2">
          {days.map((day, index) => {
            const date = weekDates[index];
            const isToday = date === today.getDate();
            return (
              <ThemedView key={index} className="items-center flex-1">
                <ThemedText className="text-sm font-semibold">{day}</ThemedText>
                <ThemedText
                  className={`text-base font-semibold mt-1 ${
                    isToday ? "text-red-500" : ""
                  }`}
                >
                  {date}
                </ThemedText>
              </ThemedView>
            );
          })}
        </ThemedView>
      </OuterThemedView>
    </ThemedView>
  );
};
