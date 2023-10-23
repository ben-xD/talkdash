import { neonConfig } from "@neondatabase/serverless";

// Allows us to use the neon client to connect to a locally running postgres, via a websocket proxy.
// See https://gal.hagever.com/posts/running-vercel-postgres-locally. Migration still happens over the original port,
// not over websockets.
export const setupWsProxyConfig = (wsProxyPort: string) => {
  console.info(`Configuring postgres client to use websocket proxy on port ${wsProxyPort}`);
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
  neonConfig.wsProxy = (host) => `${host}:${wsProxyPort}/v1`;
  neonConfig.useSecureWebSocket = false;
};
