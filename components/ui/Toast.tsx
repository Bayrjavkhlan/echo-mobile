import React from "react";
import Toast from "react-native-toast-message";
import { Text, Animated } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

interface ToastProps {
  text1?: string;
  text2?: string;
}

export default function CustomToast() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <Toast
      config={{
        error: ({ text1, text2 }: ToastProps) => {
          const translateY = new Animated.Value(0);

          Animated.timing(translateY, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();

          return (
            <Animated.View
              style={{
                backgroundColor: backgroundColor,
                padding: 12,
                borderRadius: 8,
                width: "90%",
                alignSelf: "center",
                transform: [{ translateY: translateY }],
              }}
            >
              <Text
                style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
              >
                {text1}
              </Text>
              {text2 && (
                <Text style={{ fontSize: 14, color: "white" }}>{text2}</Text>
              )}
            </Animated.View>
          );
        },
        success: ({ text1, text2 }: ToastProps) => {
          return (
            <Animated.View
              style={{
                backgroundColor: backgroundColor,
                padding: 12,
                borderRadius: 8,
                width: "90%",
                alignSelf: "center",
              }}
            >
              <Text
                style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
              >
                {text1}
              </Text>
              {text2 && (
                <Text style={{ fontSize: 14, color: "white" }}>{text2}</Text>
              )}
            </Animated.View>
          );
        },
      }}
    />
  );
}
