import * as pg from "pg";

// We need to import this file (a module augmentation - declaration merging)
declare module "vitest" {
  // For sharing data in the same test (not for sharing between tests)
  export interface TestContext {
    dbPool?: pg.Pool;
  }
}
