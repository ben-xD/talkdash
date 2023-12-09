const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Roboto Mono", "sans-serif"],
    },
    extend: {
      // Use with class, e.g. animate-jackInTheBox
      animation: {
        // Animation provided by animate.css, see https://animate.style/
        jackInTheBox: "jackInTheBox 0.5s ease-in-out 1",
      },
      colors: {
        primary: {
          "50": "var(--primary-50)",
          "100": "var(--primary-100)",
          "200": "var(--primary-200)",
          "300": "var(--primary-300)",
          "400": "var(--primary-400)",
          "500": "var(--primary-500)",
          "600": "var(--primary-600)",
          "700": "var(--primary-700)",
          "800": "var(--primary-800)",
          "900": "var(--primary-900)",
          "950": "var(--primary-950)",
        },
        secondary: {
          "50": "var(--secondary-50)",
          "100": "var(--secondary-100)",
          "200": "var(--secondary-200)",
          "300": "var(--secondary-300)",
          "400": "var(--secondary-400)",
          "500": "var(--secondary-500)",
          "600": "var(--secondary-600)",
          "700": "var(--secondary-700)",
          "800": "var(--secondary-800)",
          "900": "var(--secondary-900)",
          "950": "var(--secondary-950)",
        },
        bg: {
          "50": "var(--bg-50)",
          "100": "var(--bg-100)",
          "200": "var(--bg-200)",
          "300": "var(--bg-300)",
          "400": "var(--bg-400)",
          "500": "var(--bg-500)",
          "600": "var(--bg-600)",
          "700": "var(--bg-700)",
          "800": "var(--bg-800)",
          "900": "var(--bg-900)",
          "950": "var(--bg-950)",
        },
        // To restrict to only 1 color scheme (simpler), just choose one of the three:
        // Blue
        // primary: colors.sky,
        // secondary: colors.cyan,
        // bg: colors.indigo,
        // Lime
        // primary: colors.lime,
        // secondary: colors.teal,
        // bg: colors.lime,
        // Green
        // primary: colors.green,
        // secondary: colors.emerald,
        // bg: colors.green,
        // Indigo
        // primary: colors.indigo,
        // secondary: colors.rose,
        // bg: colors.indigo,
        primaryDark: colors.white,
        danger: colors.red,
        dangerSecondary: colors.amber,
      },
    },
  },
  plugins: [
    // https://github.com/tailwindlabs/tailwindcss-container-queries
    require("@tailwindcss/container-queries"),
  ],
};
