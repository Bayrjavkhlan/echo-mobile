import { Text, type TextProps } from "react-native";
import tw from "twrnc";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const typeStyles = {
    default: "text-base leading-6",
    defaultSemiBold: "text-base leading-6 font-semibold",
    title: "text-4xl font-bold leading-8",
    subtitle: "text-xl font-bold",
    link: "text-base leading-7 text-blue-600",
  };

  return (
    <Text
      style={[
        tw`${typeStyles[type]}`,
        { color, fontFamily: "NotoSerif" },
        style,
      ]}
      {...rest}
    />
  );
}
