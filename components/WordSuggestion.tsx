import { useRouter } from "expo-router";
import { OuterThemedView } from "./OuterThemedView";
import ThemedIcon from "./ThemedIcon";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Button } from "./ui/Button";
import { useCallback } from "react";

export default function () {
  const router = useRouter();
  const count = 2;

  const handleTodayExam = () => {
    console.log("todayexam pressed");
    router.push({
      pathname: "/group/[id]/Exam",
      params: { id: 0, name: "test" },
    });
  };
  return (
    <ThemedView className="flex-1 p-4 pb-2">
      <OuterThemedView className="flex flex-col gap-4">
        <ThemedText className="text-center">
          Таньд өнөөдөр давтах {count} үг байна{" "}
        </ThemedText>
        <Button title="Шалгалт өгөх" onPress={handleTodayExam} />
      </OuterThemedView>
    </ThemedView>
  );
}
