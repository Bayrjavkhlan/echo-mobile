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
import { deleteAllCalendarData } from "@/db/crud/calendar";
import { useSync } from "@/context/SyncContext";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import SyncStatus from "@/components/SyncStatus";
import { insertDummyData } from "@/db/crud/insertDummyData";
import { useGroupStore } from "@/store/groupStore";
import { useLabelStore } from "@/store/labelStore";
import { useFlashcardStore } from "@/store/flashcardStore";
import { useCalendarStore } from "@/store/calendarStore";
import { useWrongAnswerStore } from "@/store/wrongAnswerStore";

export default function ProfileScreen() {
  const router = useRouter();
  const networkState = useNetworkState();
  const { fullSync, isSyncing, lastSyncTime } = useSync();
  const { user, logout } = useAuth();
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSyncWithServer = async () => {
    if (!networkState.isConnected) {
      Toast.show({
        type: "error",
        text1: "Интернэт холболт алга",
        text2: "Та интернэт холболтоо шалгана уу.",
        visibilityTime: 3000,
      });
      return;
    }

    if (isSyncing) {
      Toast.show({
        type: "info",
        text1: "Түр хүлээнэ үү",
        text2: "Мэдээлэл нийцүүлэлт хийгдэж байна...",
        visibilityTime: 2000,
      });
      return;
    }

    setSyncStatus("Мэдээлэл нийцүүлэлт хийгдэж байна...");

    try {
      const result = await fullSync();

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Амжилттай",
          text2: "Мэдээлэл сервертэй амжилттай нийцлээ.",
          visibilityTime: 3000,
        });
        setSyncStatus(null);
      } else {
        const errorMessage =
          result.message || "Мэдээлэл сервертэй нийцүүлэхэд алдаа гарлаа";
        Toast.show({
          type: "error",
          text1: "Алдаа",
          text2: errorMessage,
          visibilityTime: 3000,
        });
        setSyncStatus("Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Sync error:", error);
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: "Мэдээлэл нийцүүлэхэд алдаа гарлаа.",
        visibilityTime: 3000,
      });
      setSyncStatus("Алдаа гарлаа");
    }
  };

  const handleClearDatabase = async () => {
    try {
      await deleteAllFlashcardLabelTableData();
      await deleteAllFlashcardRecords();
      await deleteAllGroupRecords();
      await deleteAllLabelTableData();
      await deleteAllCalendarData();

      await Promise.all([
        useGroupStore.getState().fetchGroups(),
        useLabelStore.getState().fetchLabels(),
        useFlashcardStore.getState().fetchFlashcards(),
        useCalendarStore.getState().fetchCalendarData(),
        useWrongAnswerStore.getState().fetchAllWrongAnswers(),
      ]);

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

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        type: "success",
        text1: "Амжилттай",
        text2: "Та системээс гарлаа.",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: "Системээс гарахад алдаа гарлаа.",
        visibilityTime: 3000,
      });
    }
  };

  const redColor = useColor("red");
  const getLastSyncTimeText = () => {
    if (!lastSyncTime) return "";
    const date = new Date(lastSyncTime);
    return ` (Сүүлд: ${date.toLocaleDateString()} ${date.toLocaleTimeString()})`;
  };

  const handleInsertDummyData = async () => {
    try {
      await insertDummyData();
      await Promise.all([
        useGroupStore.getState().fetchGroups(),
        useLabelStore.getState().fetchLabels(),
        useFlashcardStore.getState().fetchFlashcards(),
        useCalendarStore.getState().fetchCalendarData(),
        useWrongAnswerStore.getState().fetchAllWrongAnswers(),
      ]);
      Toast.show({
        type: "success",
        text1: "Амжилттай",
        text2: "Тестийн дата амжилттай нэмэгдлээ.",
        visibilityTime: 3000,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: "Тестийн дата нэмэхэд алдаа гарлаа.",
        visibilityTime: 3000,
      });
      console.error("Failed to insert dummy data:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1 p-4">
        <ThemedView className="flex justify-center items-center gap-4">
          <ProfileIcon
            userName={user?.username || "Зочин"}
            connectedToInternet={networkState.isConnected}
          />
          <ThemedView className="flex gap-2">
            {!user ? (
              <Button
                title="Нэвтрэх"
                leftIcon={<ThemedIcon name="login" size={18} />}
                rightIcon="chevron-right"
                iconSize={24}
                type="outlined"
                alignRightIcon
                size="extra"
                textClass="text-[18px]"
                onPress={handleLogin}
              />
            ) : (
              <>
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
                      params: { userId: user.id },
                    })
                  }
                />
              </>
            )}
            <SyncStatus />
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
              title="Тестийн дата"
              leftIcon={<ThemedIcon name="add" size={18} />}
              iconSize={24}
              type="outlined"
              alignRightIcon
              size="extra"
              textClass="text-[18px]"
              onPress={handleInsertDummyData}
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
            {user && (
              <Button
                title="Гарах"
                leftIcon={
                  <ThemedIcon name="logout" size={18} color={redColor} />
                }
                iconSize={24}
                type="outlined"
                alignRightIcon
                size="extra"
                textClass={`text-[18px] text-[${redColor}]`}
                color={redColor}
                onPress={handleLogout}
              />
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}
