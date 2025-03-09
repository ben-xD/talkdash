import pg from "pg";

// Module augmentation for Vitest's TestContext
declare module "vitest" {
  // For sharing data in the same test (not for sharing between tests)
  // docs: https://vitest.dev/guide/test-context.html#typescript-1
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface TestContext {
    dbPool?: pg.Pool;
  }
}
