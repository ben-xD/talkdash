import type { AppRouter } from "@talkdash/backend";
import { observable } from "@trpc/server/observable";
import { TRPCLink } from "@trpc/client";
import {
  isTRPCClientAuthenticationError,
  navigatorSignal,
  setBearerToken,
} from "./trpc.ts";
import { redirectToLoginWithRedirectBack } from "../features/auth/navigateAfterAuth.ts";

// Custom link docs: https://trpc.io/docs/client/links#creating-a-custom-link
export const redirectToAuthenticateLink: TRPCLink<AppRouter> = () => {
  // here we just got initialized in the app - this happens once per app
  // useful for storing cache for instance
  return ({ next, op }) => {
    // this is when passing the result to the next link
    // each link needs to return an observable which propagates results
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(e) {
          if (isTRPCClientAuthenticationError(e)) {
            console.error("Authentication failed, deleting credentials");
            setBearerToken(undefined);
            const navigator = navigatorSignal();

            if (navigator) {
              redirectToLoginWithRedirectBack(navigator);
            }
          }
          observer.error(e);
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};
