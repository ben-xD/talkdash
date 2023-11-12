// Used for exhaustive switch statements. Alternatively, we could do this inline:
// `return value satisfied never`
export function assertUnreachable(_: never): never {
  throw new Error("Assert unreachable failed. This should never happen.");
}
