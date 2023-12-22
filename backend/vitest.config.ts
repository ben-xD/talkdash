import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./setupTests/setupTests.ts"],
    // Not well documented, and not user friendly (It doesn't work out of the box/existing-tsconfig and needs more config)
    // typecheck: {}
  },
});
