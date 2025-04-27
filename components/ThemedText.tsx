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
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  className,
  inheritTheme = true,
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
    defaultSemiBold: tw`text-base leading-6 font-semibold`,
    title: tw`text-4xl font-bold leading-8`,
    title2: tw`text-2xl font-bold leading-8`,
    subtitle: tw`text-xl font-bold`,
    link: tw`text-base leading-7 text-blue-600`,
  };

  const mergedStyles = [
    { fontFamily: "NotoSerif" },
    typeStyles[type],
    { color },
    style,
    className ? tw.style(className) : null,
  ];

  return <Text style={mergedStyles} {...rest} />;
}
