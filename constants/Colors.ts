/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { red } from "react-native-reanimated/lib/typescript/Colors";
import { colors } from "./Themes";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#0E0E0E",
    background: "#F1EFEC",
    contentBackground: "#E5ECE9",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    red: "#FE5F55",
    gray: "#AAA",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    contentBackground: "#1E1F20",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    red: "#B8453F",
    gray: "#D6D1CD",
  },
};
