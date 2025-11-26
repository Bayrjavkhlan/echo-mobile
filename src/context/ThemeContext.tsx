import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

// Theme types
type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: {
    colors: {
      text: string;
      textSecondary: string;
      background: string;
      cardBackground: string;
      primary: string;
      border: string;
      error: string;
      success: string;
      warning: string;
    };
  };
  currentTheme: ThemeType;
  toggleTheme: () => void;
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme() as ThemeType;
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(
    colorScheme || "light"
  );

  // Update theme when system theme changes
  useEffect(() => {
    if (colorScheme) {
      setCurrentTheme(colorScheme);
    }
  }, [colorScheme]);

  // Toggle theme function
  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  // Theme values based on current theme
  const theme = {
    colors: {
      text: currentTheme === "light" ? Colors.light.text : Colors.dark.text,
      textSecondary:
        currentTheme === "light"
          ? Colors.light.textSecondary
          : Colors.dark.textSecondary,
      background:
        currentTheme === "light"
          ? Colors.light.background
          : Colors.dark.background,
      cardBackground:
        currentTheme === "light"
          ? Colors.light.contentBackground
          : Colors.dark.contentBackground,
      primary: currentTheme === "light" ? Colors.light.tint : Colors.dark.tint,
      border:
        currentTheme === "light" ? Colors.light.border : Colors.dark.border,
      error: "#F87171", // Red
      success: "#10B981", // Green
      warning: "#FBBF24", // Amber
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
