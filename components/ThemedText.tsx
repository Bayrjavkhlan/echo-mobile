import { type TextProps, StyleSheet, Text } from "react-native";
import tw from "twrnc";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "title2";
  className?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const typeStyles = {
    default: tw`text-base leading-6`,
    defaultSemiBold: tw`text-base leading-6 font-semibold`,
    title: tw`text-4xl font-bold leading-8`,
    title2: tw`text-2xl font-bold leading-8`,
    subtitle: tw`text-xl font-bold`,
    link: tw`text-base leading-7 text-blue-600`,
  };

  const mergedStyles = [
    { fontFamily: "NotoSerif" },
    typeStyles[type],
    className ? tw.style(className) : null,
    { color },
    style,
  ];

  return <Text style={mergedStyles} {...rest} />;
}
