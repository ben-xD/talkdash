declare module "vitest" {
  // For sharing data in the same test (not for sharing between tests)
  export interface TestContext {
    dbPool?: pg.Pool;
  }
}
