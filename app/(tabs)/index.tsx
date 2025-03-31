import HorizontalScrollView from "@/components/HorizontalScroll";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import Label from "@/components/ui/Label";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const labels = [
  { id: 1, name: "Home", icon: "home" },
  { id: 2, name: "Profile", icon: "user" },
  { id: 3, name: "Settings", icon: "settings" },
  { id: 4, name: "Messages", icon: "message-circle" },
  { id: 5, name: "Notifications", icon: "bell" },
  { id: 6, name: "Favorites", icon: "heart" },
  { id: 7, name: "Search", icon: "search" },
  { id: 8, name: "Camera", icon: "camera" },
  { id: 9, name: "Music", icon: "music" },
  { id: 10, name: "Weather", icon: "cloud" },
];

const labelData = {
  text: "Label123",
  color: "red",
  icon: "home",
};

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-white dark:bg-gray-900">
      <ThemedText>Home</ThemedText>
      <Label data={labelData}></Label>
    </SafeAreaView>
  );
}
