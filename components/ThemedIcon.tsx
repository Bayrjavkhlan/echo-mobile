import { useThemeColor } from "@/hooks/useThemeColor";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type IconProps = {
  name: keyof typeof MaterialIcons.glyphMap;
  lightColor?: string;
  darkColor?: string;
  color?: string;
  size?: number;
  className?: string;
  style?: object;
};

export default function ThemedIcon({
  name,
  lightColor,
  darkColor,
  color,
  size = 16,
  className,
  style,
  ...rest
}: IconProps) {
  const iconColor = useThemeColor(
    { light: lightColor, dark: darkColor },
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
