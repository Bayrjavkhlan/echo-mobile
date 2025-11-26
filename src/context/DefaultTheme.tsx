import React from "react";
import { Text, TextInput, StyleSheet } from "react-native";

/**
 * Override the default Text component to use NotoSerif
 * This must be called at the root of your application
 */
export function setupDefaultFonts() {
  // Save the original render function
  const originalTextRender = Text.render;
  const originalTextInputRender = TextInput.render;

  // Override the render function to inject our default styles
  Text.render = function (props, ref) {
    const { style, ...rest } = props;

    // Combine the default font with any other styles
    const newProps = {
      ...rest,
      style: [styles.defaultFont, style],
      ref,
    };

    return originalTextRender.call(this, newProps);
  };

  // Override TextInput render function as well
  TextInput.render = function (props, ref) {
    const { style, ...rest } = props;

    const newProps = {
      ...rest,
      style: [styles.defaultFont, style],
      ref,
    };

    return originalTextInputRender.call(this, newProps);
  };
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: "Roboto_400Regular",
  },
});
