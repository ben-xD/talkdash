// Not currently used, because auth goes through tRPC routes instead.
// To support mobile devices, we could either:
// - keep using tRPC + trpc+openapi,
// - implement separate auth routes for mobile (with Fastify OpenAPI) in this file and call registerAuthApis(fastify, auth);
//   - and eventually migrate web client to use this too.
// export const registerAuthApis = (fastify: FastifyInstance, auth: Auth) => {
//   fastify.post("/api/signup", async (request, reply) => {});
// };
