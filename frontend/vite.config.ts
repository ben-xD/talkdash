import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import solidDevtools from "solid-devtools/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // Prevent clearing screen so that there are no glitches in the output of `turbo dev`
  // when both the frontend and backend are started.
  clearScreen: false,

  plugins: [
    solidDevtools({
      /* features options - all disabled by default */
      autoname: true, // e.g. enable autoname
    }),
    solid(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,ttf,webmanifest}"],
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        short_name: "TalkDash",
        name: "TalkDash",
        description: "Remote timer with messaging functionality.",
        id: "uk.orth.talkdash",
        start_url: "/",
        background_color: "#1d4ed8",
        display: "standalone",
        scope: "/",
        theme_color: "#1d4ed8",
        icons: [
          {
            src: "/images/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/images/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/images/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
    sentryVitePlugin({
      org: "orthuk",
      project: "talkdash",
    }),
  ],

  build: {
    sourcemap: true,
  },

  define: {
    __BUILD_DATE__: new Date(),
  },
});
