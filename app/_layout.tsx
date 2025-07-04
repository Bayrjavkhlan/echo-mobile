import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
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
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
  Roboto_400Regular_Italic,
  Roboto_700Bold_Italic,
} from "@expo-google-fonts/roboto";
import { configureGlobalFonts } from "@/utils/font-config";
// import { SyncProvider } from "@/context/SyncContext";
// ene nuguu servlu offline data shidej bga
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_400Regular_Italic,
    Roboto_700Bold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      configureGlobalFonts();
    }
  }, [fontsLoaded]);

  const navigation = useNavigation();

  const expo = SQLite.openDatabaseSync("echo.db");

  const db = drizzle(expo);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

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

  if (!fontsLoaded) {
    return null;
  }

  if (error) {
    console.log("Migration error:", error);
    return (
      <View>
        <Text style={{ fontFamily: "Roboto_400Regular" }}>
          Migration error: {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text style={{ fontFamily: "Roboto_400Regular" }}>
          Migration is in progress...
        </Text>
      </View>
    );
  }

  // Create a theme with Roboto font for headers
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  // Configure sync options
  const syncOptions = {
    syncOnAppOpen: true,
    syncOnNetworkChange: true,
    syncInterval: 15, // sync every 15 minutes
    enableBackgroundSync: true,
    maxRetries: 3,
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        {/* <SyncProvider options={syncOptions}> */}
        <NavigationThemeProvider value={theme}>
          <Stack
            initialRouteName="(tabs)"
            screenOptions={{
              headerTitleStyle: {
                fontFamily: "Roboto_400Regular",
              },
              headerBackTitleStyle: {
                fontFamily: "Roboto_400Regular",
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="labelModal"
              options={{
                title: "Шошго нэмэх",
                headerShown: true,
                presentation: "modal",
              }}
            />

            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
          <Toast />
        </NavigationThemeProvider>
        {/* </SyncProvider> */}
      </AuthProvider>
    </ThemeProvider>
  );
}
