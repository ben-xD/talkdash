/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Roboto Mono", "sans-serif"],
    },
    extend: {},
  },
  plugins: [
    // https://github.com/tailwindlabs/tailwindcss-container-queries
    require("@tailwindcss/container-queries"),
  ],
};
