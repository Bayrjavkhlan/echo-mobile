import { useThemeColor } from "@/hooks/useThemeColor";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useInheritedTheme } from "../context/ThemeInheritContext";

type IconProps = {
  name: keyof typeof MaterialIcons.glyphMap;
  lightColor?: string;
  darkColor?: string;
  color?: string;
  size?: number;
  className?: string;
  style?: object;
  inheritTheme?: boolean;
};

export default function ThemedIcon({
  name,
  lightColor,
  darkColor,
  color,
  size = 16,
  className,
  style,
  inheritTheme = true,
  ...rest
}: IconProps) {
  const inheritedColors = useInheritedTheme();

  const finalLightColor =
    lightColor || (inheritTheme ? inheritedColors.textLightColor : undefined);
  const finalDarkColor =
    darkColor || (inheritTheme ? inheritedColors.textDarkColor : undefined);

  const iconColor = useThemeColor(
    { light: finalLightColor, dark: finalDarkColor },
    "text"
  );

  return (
    <MaterialIcons
      name={name}
      color={iconColor}
      size={size}
      className={className}
      style={[style, { color: iconColor }]}
      {...rest}
    />
  );
}
