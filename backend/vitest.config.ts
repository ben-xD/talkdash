import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./setupTests/setupTests.ts"],
    typecheck: {
      tsconfig: "tsconfig.lint.json",
    },
  },
});
