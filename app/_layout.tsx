import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "@/utils/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";
import CustomToast from "@/components/ui/Toast";
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { View, Text } from "react-native";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    // SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    NotoSerif: require("../assets/fonts/NotoSerif_Condensed-Medium.ttf"),
  });

  const navigation = useNavigation();

  const expo = SQLite.openDatabaseSync("echo.db");

  const db = drizzle(expo);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      const currentRoute =
        navigation.getState()?.routes[navigation.getState()?.index ?? 0];
      console.log("Current page:", currentRoute?.name);
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  if (!loaded) {
    return null;
  }

  if (error) {
    console.log("Migration error:", error);
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="group/[id]"
          options={{
            title: "Group Details",
            headerShown: true,
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="labelModal"
          options={{
            title: "Шошго нэмэх",
            headerShown: true,
            presentation: "modal",
          }}
        />
        <Stack.Screen name="screens/login.page" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
