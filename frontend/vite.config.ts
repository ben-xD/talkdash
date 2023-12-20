import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";
import solidDevtools from "solid-devtools/vite";
import { VitePWA } from "vite-plugin-pwa";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import "dotenv/config";

export default defineConfig({
  // Prevent clearing screen so that there are no glitches in the output of `turbo dev`
  // when both the frontend and backend are started.
  clearScreen: false,

  plugins: [
    solidDevtools({
      /* features options - all disabled by default */
      autoname: true, // e.g. enable autoname
    }),
    mdx({ jsxImportSource: "solid-jsx", remarkPlugins: [remarkGfm] }),
    solid(),
    VitePWA({
      registerType: "prompt",
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
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      sourcemaps: {
        // Careful, this only works when the token is available. Otherwise, the sourcemaps are generated but not deleted.
        filesToDeleteAfterUpload: ["**/*.js.map"],
      },
      // To debug:
      debug: true,
    }),
  ],

  build: {
    // Needs to be enabled for Sentry, but we use sentry's `filesToDeleteAfterUpload` to prevent browsers
    // to read the full source code of the project.
    sourcemap: true,
  },

  define: {
    __BUILD_DATE__: new Date(),
  },

  test: {
    environment: "jsdom",
    testTransformMode: { web: ["/.[jt]sx?$/"] },
  },
});
