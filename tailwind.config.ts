import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      ...colors, // keep Tailwind’s default colors (blue-500, gray-700, etc.)
      primary: "#FAFAFA",
      secondary: "#633CFF",
      tertiary: "#BEADFF",
      black: "#333333",
      red: "#FF3939",
      gray: "#737373",
      purple: "#EFEBFF",
      dark: "#EEEEEE",
    },
    extend: {
      fontFamily: {
        sans: ["Instrument Sans", "sans-serif"],
      },
      boxShadow: {
        "custom-shadow":
          "0 4px 15px rgba(190, 173, 255, 0.6), 0 1px 10px rgba(190, 173, 255, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
