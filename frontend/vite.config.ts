import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";
import solidDevtools from "solid-devtools/vite";
import { VitePWA } from "vite-plugin-pwa";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import "dotenv/config";

// `process.env` is only available in Cloudflare CI if the environment variable is set, not if it is in the .env file.
// The auth token is available there, just `export` it to test publishing sourcemaps to sentry.
// `process.env` is not available at all unless you load from an .env file.
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const isRunningOnCloudflareCi = process.env.CF_PAGES_BRANCH;
if (isRunningOnCloudflareCi && !sentryAuthToken) {
  throw new Error(
    "Sentry auth token not set, cannot publish sourcemaps to sentry.",
  );
}

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
      authToken: sentryAuthToken,
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
