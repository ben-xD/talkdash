import { TRPCError } from "@trpc/server";

// Weirdly, UNAUTHORIZED is for authentication errors, and FORBIDDEN is for authorization errors.
// > There's a problem with 401 Unauthorized, the HTTP status code for authentication errors.
// See https://stackoverflow.com/a/6937030/7365866
export const throwUnauthenticatedError = (message?: string): never => {
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message,
  });
};

export const throwNonAnonymousError = (message?: string): never => {
  throw new TRPCError({
    code: "PRECONDITION_FAILED",
    message,
  });
};

export const throwUnauthorizedError = (message?: string): never => {
  throw new TRPCError({ code: "FORBIDDEN", message });
};

export const internalServerError = new TRPCError({
  code: "INTERNAL_SERVER_ERROR",
});
