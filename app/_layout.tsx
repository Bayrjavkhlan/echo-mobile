import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "@/utils/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { initDatabase } from "@/app/services/databaseService";
import { NetworkProvider } from "@/context/NetworkContext";
import { flashcardApi } from "@/app/services/flashcardService";
import { View, Text } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    // SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    NotoSerif: require("../assets/fonts/NotoSerif_Condensed-Medium.ttf"),
  });

  const navigation = useNavigation();
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the SQLite database
    initDatabase()
      .then(() => {
        console.log("Database initialized successfully");
        setIsDatabaseReady(true);
      })
      .catch((error) => {
        console.error("Failed to initialize database:", error);
        setDbError("Failed to initialize database");
      });
  }, []);

  useEffect(() => {
    if (loaded && isDatabaseReady) {
      SplashScreen.hideAsync();

      // Set up a timer to periodically sync changes when the app is running
      const syncInterval = setInterval(() => {
        flashcardApi.syncChanges().catch((error) => {
          console.error("Error during automatic sync:", error);
        });
      }, 60000); // Sync every minute

      return () => {
        clearInterval(syncInterval);
      };
    }
  }, [loaded, isDatabaseReady]);

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

  if (!loaded || !isDatabaseReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{dbError || "Loading..."}</Text>
      </View>
    );
  }

  return (
    <NetworkProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </NetworkProvider>
  );
}
