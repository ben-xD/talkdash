import { TRPCError } from "@trpc/server";
import {
  throwNonAnonymousError,
  throwUnauthenticatedError,
} from "../auth/errors.js";

// Must be a function, not arrow function. See https://github.com/microsoft/TypeScript/issues/34523
export function assertAuth<T>(
  name: string,
  value: T | null | undefined,
): asserts value is Exclude<T, null | undefined> {
  if (value === null || value === undefined) {
    throwUnauthenticatedError(`Protected route called without ${name}`);
  }
}

// This can be in a middleware. TODO try it
export function assertAnonymous<T>(
  name: string,
  value: T | null | undefined,
): asserts value is null | undefined {
  if (value !== null && value === undefined) {
    throwNonAnonymousError(`Anonymous route called with ${name}`);
  }
}

export function assertWebsocketClient(
  protocol: "ws" | "http",
): asserts protocol is "ws" {
  if (protocol !== "ws") {
    throw new TRPCError({
      code: "METHOD_NOT_SUPPORTED",
      message: `Websocket protocol required, got ${protocol}. HTTP not yet implemented.`,
    });
  }
}
