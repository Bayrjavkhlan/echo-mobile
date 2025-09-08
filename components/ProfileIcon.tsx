import ThemedIcon from "./ThemedIcon";
import { ThemedView } from "./ThemedView";
import { Image, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";
import { useColor } from "@/hooks/useThemeColor";

interface ProfileIconProps {
  userName?: string;
  connectedToInternet?: boolean;
}

export default function ProfileIcon({
  userName,
  connectedToInternet,
}: ProfileIconProps) {
  const blueColor = useColor("title");
  const contentBackground = useColor("contentBackground");

  return (
    <ThemedView className="w-full flex gap-4">
      <ThemedView className="flex items-center">
        <ThemedView className="flex gap-2 h-[120px] w-[120px]">
          <Image
            source={require("../assets/images/profile.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderColor: connectedToInternet ? "green" : "gray",
              borderWidth: 2,
            }}
          />
          <Pressable onPress={() => console.log("profile edit button pressed")}>
            <ThemedView
              className="absolute bottom-1 right-5 w-9 h-9 rounded-full justify-center items-center"
              customBackgroundColor={blueColor}
            >
              <ThemedIcon
                name="border-color"
                size={18}
                color={contentBackground}
              />
            </ThemedView>
          </Pressable>
        </ThemedView>
        <ThemedText className="text-xl ">
          {userName ? userName : "Jack"}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
