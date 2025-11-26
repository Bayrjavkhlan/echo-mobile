import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export const Settings = () => {
  return (
    <ThemedView className="flex-1 p-4">
      <ThemedText className="text-lg font-bold">Settings</ThemedText>
      <ThemedView className="flex-1 justify-center items-center">
        {/* <ProfileIcon userName="Баяржавхлан" /> */}
      </ThemedView>
    </ThemedView>
  );
};
