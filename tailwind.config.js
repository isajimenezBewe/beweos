import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        "purple": {
          extend: "light", // <- inherit default values from light theme
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              50: "#FEECFE",
              100: "#FDD5F9",
              200: "#FCADF9",
              300: "#F182F6",
              400: "#DD62ED",
              500: "#c031e2",
              600: "#9823C2",
              700: "#7318A2",
              800: "#520F83",
              900: "#3B096C",
              DEFAULT: "#9823C2",
              foreground: "#ffffff",
            },
            focus: "#9823C2",
          },
        },
        "purple-dark": {
          extend: "dark", // <- inherit default values from dark theme
          colors: {
            background: "#0D001A",
            foreground: "#ffffff",
            primary: {
              50: "#3B096C",
              100: "#520F83",
              200: "#7318A2",
              300: "#9823C2",
              400: "#c031e2",
              500: "#DD62ED",
              600: "#F182F6",
              700: "#FCADF9",
              800: "#FDD5F9",
              900: "#FEECFE",
              DEFAULT: "#DD62ED",
              foreground: "#ffffff",
            },
            focus: "#F182F6",
          },
        },
      },
    }),
  ],
}
