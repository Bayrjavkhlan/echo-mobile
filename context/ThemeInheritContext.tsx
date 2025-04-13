import React, { createContext, useContext } from "react";

interface ThemeColors {
  // Background colors
  lightColor?: string;
  darkColor?: string;

  // Text colors
  textLightColor?: string;
  textDarkColor?: string;
}

const ThemeInheritContext = createContext<ThemeColors>({});

export const ThemeInheritProvider: React.FC<{
  children: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
  textLightColor?: string;
  textDarkColor?: string;
}> = ({ children, lightColor, darkColor, textLightColor, textDarkColor }) => {
  return (
    <ThemeInheritContext.Provider
      value={{
        lightColor,
        darkColor,
        textLightColor,
        textDarkColor,
      }}
    >
      {children}
    </ThemeInheritContext.Provider>
  );
};

export const useInheritedTheme = (): ThemeColors => {
  return useContext(ThemeInheritContext);
};
