// import { FastifyInstance, FastifyPluginAsync } from "fastify";
//
// declare module "fastify" {
//   interface FastifyRequest {
//     myPluginProp: string;
//   }
//   interface FastifyReply {
//     myPluginProp: number;
//   }
// }

// // define options
// export interface CustomAuthPluginOptions {
//   handleRawRequest: string;
// }
// export const customAuthPlugin: FastifyPluginAsync<CustomAuthPluginOptions> = (
//   fastify,
//   options,
// ) => {
//   fastify.decorateRequest("handleRawRequest", () => {
//     const raw = this.raw;
//   });
// };
//
// function registerAuth(fastify: FastifyInstance) {
//   fastify.register(customAuthPlugin);
// }

// need the db here too
import { FastifyInstance, FastifyRequest } from "fastify";
import { Auth } from "@auth/core";
import { createAuthJsConfig } from "../auth/auth.js";
import { Database } from "../db/db.js";

export const registerAuthApis = (fastify: FastifyInstance, db: Database) => {
  const authConfig = createAuthJsConfig(db);
  fastify.all("/api/auth/*", (request, reply) => {
    // Adapting the nextJS path in https://authjs.dev/guides/basics/initialization?frameworks=next#advanced-initialization
    const authRequest = createNodeFetchRequestFromFastifyRequest(request);
    return Auth(authRequest, authConfig);
  });
};

const createNodeFetchRequestFromFastifyRequest = (request: FastifyRequest) => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(",") : value);
    } else {
      console.info(`Dropping header (${key}) with undefined value`);
    }
  }
  return new Request(new URL(request.hostname + request.url), {
    method: request.method,
    // body: req.body, // we don't need the body, we just want to authenticate.
    headers,
  });
};
