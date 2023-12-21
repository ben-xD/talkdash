import * as pg from "pg";

// We need to import this file (a module augmentation - declaration merging)
declare module "vitest" {
  // For sharing data in the same test (not for sharing between tests)
  // docs: https://vitest.dev/guide/test-context.html#typescript-1
  export interface TestContext {
    dbPool?: pg.Pool;
  }
}
