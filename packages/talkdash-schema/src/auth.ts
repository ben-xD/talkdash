import { z } from "zod";

export const oAuthProviders = z.union([
  z.literal("github"),
  z.literal("google"),
]);
export type OAuthProviders = z.infer<typeof oAuthProviders>;
