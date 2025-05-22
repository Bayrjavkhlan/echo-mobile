import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import config from "@/config";
import { Button } from "@/components/ui/Button";
import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/ThemedText";
import { OuterThemedView } from "@/components/OuterThemedView";
import Toast from "react-native-toast-message";

const SERVER_URL = config.SERVER_URL;

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: "Бүх талбарыг бөглөнө үү.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/auth/login/mobile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Use the login function from auth context
      await login(data.token.access_token, {
        id: data.user.id.toString(),
        username: data.user.username,
        email: data.user.email || "",
      });

      // Navigation will be handled by auth context
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: `Нэвтрэхэд алдаа гарлаа. ${error.message}`,
        visibilityTime: 3000,
      });
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignUp = () => {
    router.push("/signUp" as any);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <ScrollView contentContainerStyle={styles.container}>
          <OuterThemedView>
            <Text style={styles.title}>Echo</Text>
            <ThemedText style={styles.subtitle}>Нэвтрэх</ThemedText>

            <Input
              title="Нэвтрэх нэр"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Input
              title="Нууц үг"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              title={isLoading ? "Шалгаж байна..." : "Нэвтрэх"}
              onPress={handleLogin}
              disabled={isLoading}
              size="extra"
            />

            <ThemedView className="flex flex-row justify-center mt-4">
              {/* <ThemedText>Аккаунт байхгүй юу? </ThemedText> */}
              <Button
                title="Бүртгүүлэх"
                onPress={navigateToSignUp}
                type="text"
                color="primary"
              />
            </ThemedView>
          </OuterThemedView>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 30,
  },
});
