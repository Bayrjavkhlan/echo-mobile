import { View, type ViewProps } from "react-native";
import tw from "twrnc";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  useInheritedTheme,
  ThemeInheritProvider,
} from "../context/ThemeInheritContext";

export type ThemedViewProps = ViewProps & {
  className?: string;
  lightColor?: string;
  darkColor?: string;
  textLightColor?: string;
  textDarkColor?: string;
  inheritTheme?: boolean;
};
// Todo: color combonuud uusged terige ashiglana
export function ThemedView({
  style,
  lightColor,
  darkColor,
  textLightColor,
  textDarkColor,
  className,
  inheritTheme = true,
  children,
  ...otherProps
}: ThemedViewProps) {
  const inheritedColors = useInheritedTheme();

  const finalLightColor =
    lightColor || (inheritTheme ? inheritedColors.lightColor : undefined);
  const finalDarkColor =
    darkColor || (inheritTheme ? inheritedColors.darkColor : undefined);

  const finalTextLightColor =
    textLightColor ||
    (inheritTheme ? inheritedColors.textLightColor : undefined);
  const finalTextDarkColor =
    textDarkColor || (inheritTheme ? inheritedColors.textDarkColor : undefined);

  const backgroundColor = useThemeColor(
    { light: finalLightColor, dark: finalDarkColor },
    "background"
  );

  const wrappedChildren =
    finalLightColor ||
    finalDarkColor ||
    finalTextLightColor ||
    finalTextDarkColor ? (
      <ThemeInheritProvider
        lightColor={finalLightColor}
        darkColor={finalDarkColor}
        textLightColor={finalTextLightColor}
        textDarkColor={finalTextDarkColor}
      >
        {children}
      </ThemeInheritProvider>
    ) : (
      children
    );

  return (
    <View
      style={[tw`${className || ""}`, { backgroundColor }, style]}
      {...otherProps}
    >
      {wrappedChildren}
    </View>
  );
}
