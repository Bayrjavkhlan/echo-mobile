import { type TextProps, StyleSheet, Text } from "react-native";
import tw from "twrnc";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useInheritedTheme } from "../context/ThemeInheritContext";

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
  inheritTheme?: boolean;
  textColor?: string;
  weight?: "regular" | "bold";
  italic?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  className = "",
  inheritTheme = true,
  textColor,
  weight = "regular",
  italic = false,
  ...rest
}: ThemedTextProps) {
  const inheritedColors = useInheritedTheme();

  const finalLightColor =
    lightColor || (inheritTheme ? inheritedColors.textLightColor : undefined);
  const finalDarkColor =
    darkColor || (inheritTheme ? inheritedColors.textDarkColor : undefined);

  const color = useThemeColor(
    { light: finalLightColor, dark: finalDarkColor },
    "text"
  );

  const typeStyles = {
    default: tw`text-base leading-6`,
    defaultSemiBold: tw`text-base leading-6`,
    title: tw`text-4xl font-bold leading-8`,
    title2: tw`text-2xl font-bold leading-8`,
    subtitle: tw`text-xl font-bold`,
    link: tw`text-base leading-7 text-blue-600`,
  };

  const hasBold =
    className.includes("font-bold") || className.includes("font-semibold");

  let isBold =
    hasBold ||
    weight === "bold" ||
    ["title", "title2", "subtitle", "defaultSemiBold"].includes(type);

  let isItalic = italic || className.includes("italic");

  let fontFamily;
  if (isBold && isItalic) {
    fontFamily = "Roboto_700Bold_Italic";
  } else if (isBold) {
    fontFamily = "Roboto_700Bold";
  } else if (isItalic) {
    fontFamily = "Roboto_400Regular_Italic";
  } else {
    fontFamily = "Roboto_400Regular";
  }

  const mergedStyles = [
    { fontFamily },
    typeStyles[type],
    { color: textColor ? textColor : color },
    style,
    className ? tw.style(className) : null,
  ];

  return <Text style={mergedStyles} {...rest} />;
}
