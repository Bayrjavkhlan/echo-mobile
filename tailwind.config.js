/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto_400Regular"],
        roboto: ["Roboto_400Regular"],
        "roboto-regular": ["Roboto_400Regular"],
        "roboto-bold": ["Roboto_700Bold"],
        "roboto-italic": ["Roboto_400Regular_Italic"],
        "roboto-bold-italic": ["Roboto_700Bold_Italic"],
      },
      fontWeight: {
        normal: "normal",
        medium: "normal",
        semibold: "normal",
        bold: "normal",
      },
    },
  },
  plugins: [],
  safelist: [{ pattern: /text-\[#([A-Fa-f0-9]{6})\]/ }],
};
