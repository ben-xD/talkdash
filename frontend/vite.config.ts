import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  // Prevent clearing screen so that there are no glitches in the output of `turbo dev`
  // when both the frontend and backend are started..
  clearScreen: false,
  plugins: [solid()],
});
