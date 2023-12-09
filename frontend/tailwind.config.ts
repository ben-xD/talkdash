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
        primary: colors.blue,
        secondary: colors.cyan,
        bg: colors.blue,
        // More color themes:
        // primary: colors.green,
        // secondary: colors.emerald,
        // bg: colors.green,
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
