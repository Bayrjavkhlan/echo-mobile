import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "../config";
import { Colors } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ThemedView } from "@/components/ThemedView";
import { OuterThemedView } from "@/components/OuterThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@/components/ui/Input";
import Toast from "react-native-toast-message";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSignUp = async () => {
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: "Бүх талбарыг бөглөнө үү.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: "Нууц үг таарахгүй байна.",
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: "Нууц үг 6-аас дээш тэмдэгттэй байх ёстой.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending signup request to:", `${SERVER_URL}/auth/signup`);

      const response = await fetch(`${SERVER_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName || undefined,
        }),
      });

      console.log("Signup response status:", response.status);

      // Get the raw text response before trying to parse JSON
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText);
        console.log("Signup response data:", JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.log("Failed to parse response as JSON:", parseError);
        throw new Error(
          `Server returned invalid JSON. Status: ${
            response.status
          }, Body: ${responseText.substring(0, 100)}...`
        );
      }

      if (!response.ok) {
        // Extract the error message from the response
        let errorMessage = "Sign up failed";

        if (data.detail) {
          errorMessage =
            typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail);
        }

        throw new Error(errorMessage);
      }

      // Use the login function from auth context
      await login(data.token.access_token, {
        id: data.user.id.toString(),
        username: data.user.username,
        email: data.user.email || "",
      });

      Toast.show({
        type: "success",
        text1: "Амжилттай",
        text2: "Таны бүртгэл амжилттай хийгдлээ.",
        visibilityTime: 3000,
      });

      // Navigation will be handled by auth context
    } catch (error: any) {
      console.log("Signup error:", error);

      // Ensure we get a string message even if error is an object
      const errorMessage =
        error.message ||
        (typeof error === "object"
          ? JSON.stringify(error)
          : "An unknown error occurred");

      Toast.show({
        type: "error",
        text1: "Алдаа",
        text2: `Бүртгэхэд алдаа гарлаа. ${errorMessage}`,
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push("/login" as any);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <OuterThemedView>
          <Text style={styles.title}>Echo</Text>
          <ThemedText style={styles.subtitle}>Бүртгүүлэх</ThemedText>

          <Input
            title="Нэвтрэх нэр"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Input
            title="И-мэйл хаяг"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            title="Нууц үг"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input
            title="Нууц үг давтах"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button
            title={isLoading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            onPress={handleSignUp}
            disabled={isLoading}
            size="extra"
          />

          <ThemedView className="flex flex-row justify-center mt-4">
            <Button
              title="Нэвтрэх"
              onPress={navigateToLogin}
              type="text"
              color="primary"
            />
          </ThemedView>
        </OuterThemedView>
      </ScrollView>
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
