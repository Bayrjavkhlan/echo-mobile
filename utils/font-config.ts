import { TextProps, TextStyle, Text, TextInput } from "react-native";

// This function can be called in your app's entry point
export function configureGlobalFonts() {
  // Extend the base TextProps to override the default styles
  // @ts-ignore - extend internal react-native type
  Text.defaultProps = Text.defaultProps || {};

  // Override the Text component's render method to handle fontWeight properly
  const originalRender = Text.render;
  Text.render = function (props, ref) {
    const { style, ...otherProps } = props;

    // Apply default font to all Text components
    const newStyle = [{ fontFamily: "Roboto_400Regular" }, style];

    const newProps = {
      ...otherProps,
      style: newStyle,
      ref,
    };

    return originalRender.call(this, newProps);
  };

  // Do the same for TextInput
  // @ts-ignore - extend internal react-native type
  TextInput.defaultProps = TextInput.defaultProps || {};

  const originalInputRender = TextInput.render;
  TextInput.render = function (props, ref) {
    const { style, ...otherProps } = props;

    // Always use the regular font for inputs
    const newStyle = [{ fontFamily: "Roboto_400Regular" }, style];

    const newProps = {
      ...otherProps,
      style: newStyle,
      ref,
    };

    return originalInputRender.call(this, newProps);
  };
}
