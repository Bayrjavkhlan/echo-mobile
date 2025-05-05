import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import ProfileIcon from "@/components/ProfileIcon";
import { useColor } from "@/hooks/useThemeColor";
import { Button } from "@/components/ui/Button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNetworkState } from "expo-network";
import { deleteAllFlashcardLabelTableData } from "@/db/crud/flashcardLabels";
import { deleteAllFlashcardRecords } from "@/db/crud/flashcards";
import { deleteAllGroupRecords } from "@/db/crud/group";
import { deleteAllLabelTableData } from "@/db/crud/labels";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import ThemedIcon from "@/components/ThemedIcon";

export default function ProfileScreen() {
  const router = useRouter();
  const networkState = useNetworkState();
  const handleClearDatabase = async () => {
    try {
      await deleteAllFlashcardLabelTableData();
      await deleteAllFlashcardRecords();
      await deleteAllGroupRecords();
      await deleteAllLabelTableData();

      Toast.show({
        type: "success",
        text1: "Амжилттай",
        text2: "Бүх флашкартыг амжилттай устгалаа.",
        visibilityTime: 3000,
      });
      console.log("✅ All tables cleared.");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: "Бүх флашкартыг устгахад алдаа гарлаа.",
        visibilityTime: 3000,
      });
      console.error("❌ Failed to clear database tables:", error);
    }
  };
  const redColor = useColor("red");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1 p-4">
        <ThemedView className="flex justify-center items-center gap-4">
          <ProfileIcon
            userName="Баяржавхлан"
            connectedToInternet={networkState.isConnected}
          />
          <ThemedView className="flex gap-2">
            <Button
              title="Нэвтрэх"
              leftIcon={<ThemedIcon name="login" size={18} />}
              rightIcon="chevron-right"
              iconSize={24}
              type="outlined"
              alignRightIcon
              size="extra"
              textClass="text-[18px]"
              onPress={() => console.log("login pressed")}
            />
            <Button
              title="Хувийн мэдээлэлээ өөрчлөх"
              leftIcon={<ThemedIcon name="edit" size={18} />}
              rightIcon="chevron-right"
              iconSize={24}
              type="outlined"
              alignRightIcon
              size="extra"
              textClass="text-[18px]"
              buttonClass="flex items-center"
              onPress={() =>
                router.push({
                  pathname: "/profileScreens/UserEdit",
                  params: { userId: "0628" },
                })
              }
            />
            <Button
              title="Тохиргоо"
              leftIcon={<ThemedIcon name="settings" size={18} />}
              rightIcon="chevron-right"
              iconSize={24}
              type="outlined"
              alignRightIcon
              size="extra"
              textClass="text-[18px]"
              onPress={() => console.log("2 pressed")}
            />
            <Button
              title="Сервертэй мэдээлэл нийцүүлэх"
              leftIcon={
                <ThemedIcon name="sentiment-very-satisfied" size={18} />
              }
              iconSize={24}
              type="outlined"
              alignRightIcon
              size="extra"
              textClass="text-[18px]"
              onPress={() => console.log("sync with server pressed")}
            />
            <Button
              title="Санал хүсэлт илгээх"
              leftIcon={
                <ThemedIcon name="sentiment-very-satisfied" size={18} />
              }
              iconSize={24}
              type="outlined"
              alignRightIcon
              size="extra"
              textClass="text-[18px]"
              onPress={() => console.log("3 pressed")}
            />
            <Button
              title="Бүх мэдээлэлийг устгах"
              leftIcon={<ThemedIcon name="delete" size={18} color={redColor} />}
              iconSize={24}
              type="outlined"
              alignRightIcon
              size="extra"
              textClass={`text-[18px] text-[${redColor}]`}
              color={redColor}
              onPress={handleClearDatabase}
            />
            <Button
              title="Гарах"
              leftIcon={<ThemedIcon name="logout" size={18} color={redColor} />}
              iconSize={24}
              type="outlined"
              alignRightIcon
              size="extra"
              textClass={`text-[18px] text-[${redColor}]`}
              color={redColor}
              onPress={() => console.log("logout pressed")}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}
