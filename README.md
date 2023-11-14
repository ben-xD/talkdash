# [TalkDash](https://talkdash.orth.uk)

Tools for event hosts and presenters, available on https://talkdash.orth.uk. 
A more bleeding edge, unstable version is available on https://v2.talkdash.orth.uk/

Features:
- Show large (fullscreen) timer and timer on speaker screen
- Event hosts can text-message event speakers whilst they talk 
  - For example, "you have 10 minutes left" and remind them to "repeat the audience questions"
  - Messages are enhanced with Emojis using Cloudflare Workers AI
- Works offline 
  - On Chrome, you can install it
  - Some features require network connectivity (messaging)
- Large clock and stopwatch pages

## Technology
- Frontend: [Solid](https://tailwindcss.com/), [Solid Router](https://docs.solidjs.com/guides/how-to-guides/routing-in-solid/solid-router), [Tailwind](https://tailwindcss.com/), [ARK UI](https://ark-ui.com/) (headless UI library)
- Backend: Node, Fastify, tRPC and zod
  - Fastify for anything tRPC doesn't support: e.g. file uploads, 3rd party clients, rigid authentication libraries
  - Initially tried [Bun](https://bun.sh/) and [Bao](https://github.com/mattreid1/baojs)
    - Bao bun bug? Error: `TypeError: null is not an object (evaluating 'res.status')` internal to Bao, with no stack trace (Bun?). There was no way past this error, perhaps Bao is not compatible with the latest Bun. 
    - I wanted to use [Fastify](https://fastify.dev/) but Jarred said ['Fastify is not fast in bun.'](https://news.ycombinator.com/item?id=37800505).
    - Testing: [HTTPie](https://httpie.io/app) and [websocat](https://github.com/vi/websocat).
    - Drizzle not generating any migration files when using bun. [GitHub issue](https://github.com/drizzle-team/drizzle-kit-mirror/issues/199)
  - APIs. Unauthenticated clients can connect to the websocket, use basic APIs, call the APIs to authenticate, and call authorized APIs.
    - All APIs support WebSocket
    - [Subscriptions](https://trpc.io/docs/subscriptions) (server sending messages to client) are not supported by the HTTP API
    - The API supports cookies and bearer token authentication based on the API request
- Database: Postgres (Neon) and drizzle orm
  - I don't really benefit from the "serverless" nature of Neon, since the backend is not serverless (because durable objects are not on the Cloudflare free tier, and also they tend to become expensive with use) 
  - However, I may use cloudflare workers in the future for other things, and using the neon serverless http API for that could be useful
  - Local postgres database is used locally
- Deployment: [Fly.io](https://fly.io), [Cloudflare Pages, Cloudflare workers](https://www.cloudflare.com/en-gb/) (Fly.io for websocket connections, because Cloudflare Durable Objects are expensive)
  - Cloudflare pages build settings: 
    - Framework preset: `None`
    - Build command: `npm install -g turbo && turbo build`
    - Build output directory: `frontend/dist`
    - Extra environment variable: `VITE_BACKEND_URL=wss://talkdash.fly.dev`
    - Reminder: scale down to 1 machine using `flyctl scale count 1` because the backend is the message broker - we want all users connected to the same instance. See https://community.fly.io/t/how-deploy-to-just-one-machine/12510/2
- Image generated using [sdxl-emoji](https://replicate.com/fofr/sdxl-emoji), background removed using Modyfi.com, optimised with https://tinypng.com/, and favicons generated using https://realfavicongenerator.net/
- OpenAI / GPT3.5 turbo: for converting text into durations (e.g. time for lunch -> 30 minutes) 
  - I use [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/) to measure the usage and cost of OpenAI API usage for this app

## TODOs

- Disable Google Auth fully (make it easy to toggle)
- TODO show logged in page after logging in or signing up
- Redirect to `/sign-in` if 401 error is received
- Implement GitHub and Google OAuth. See https://lucia-auth.com/oauth/
- Horizontal scalability and lower latency? I have a single Node backend
  - Even if clients pick the region consistently, they still need to talk to each other
  - Using tRPC subscriptions means we need 1 tRPC application to connect to all clients, making it a single point of failure  
  - Try redis streams? 
  - Try partykit for everything that needs realtime functionality
    - Everything else is tRPC over websocket or HTTP, but without "subscriptions" 
    - We won't benefit from the subscriptions procedures
  - Alternatively, deploy a separate "notification" tRPC backend, that all clients connect to. (A single point of failure, but dedicated only to subscriptions).
    - However, this means there'll still work to write routers for authentication for websockets
  - Also, using Websockets for tRPC prevents me from redirect users using `Location` and setting cookies, since the user doesn't get any headers as response
    - This just means the frontend needs to handle redirecting when logging in and use bearer authentication.
- Authentication
  - Implement UI for user accounts (email sign up, login, sign out, set public password)
  - Implement email verification 
  - Implement password reset
  - Implement updating user information (for example, name)
  - Test error edge cases and returned codes
  - Support event hosts and audience
  - Implement rate limiting for auth endpoints using Redis, Upstash, or Cloudflare-KV?
- Fix type safety: When lucia promise is not awaited, typescript doesn't detect it.
- Implement audience mode
- Add access control for event host controls
- Nicer glow background 
- Command + enter to send message
- Command + K for command palette
- Themes: users can select different colors, which would get different birds too
- Zen mode
- View and adjust time remaining for the speaker remotely as Event Host
  - Keep timer working local-first (doesn't require connection)
  - Convert human-readable talk length into duration
- Bugs:
  - Can't click on navigation menu buttons (Audience, Host) on mobile. [Issue](https://github.com/chakra-ui/ark/issues/1600)
  - Don't show disconnected / connected for 1 second (delay it so it doesn't glitch)
- AI ideas:
  - record event host message from voice (STT) - whisper on Cloudflare - but won't be used at events to avoid distracing audience
  - Filter messages for safety and edit it for being funny - not really possible, Llama2 throws "ethics" error
  - Text-to-speech and add play button on speaker screen - elevenlabs code `ElevenLabsJam` - ElevenLabs is expensive
  - Group similar messages together. Store questions, and cluster based on category/relevance. Use Workers AI vectorize database? 
- Consider: astro.build
- Consider: server side rendering, see https://www.solidjs.com/guides/server
- Use [postcss-nested](https://github.com/postcss/postcss-nested) if needed


## Performance?
- Need performance? 
  - consider tRPC over uWebsockets, using https://github.com/romanzy313/trpc-uwebsockets?
  - consider [Elysia](https://elysiajs.com/) on Bun instead of tRPC on Node.

## Contributing
- Install nvm, run `nvm install` and `nvm alias default` to set the default node version to the one in `.nvmrc`.
- Install pnpm: `npm install --global pnpm`
  - to upgrade, run `npm install --global --upgrade pnpm`
- Install turbo, run `pnpm install turbo --global`
- `pnpm i`

### Useful links
- API on https://talkdash.fly.dev
- API UI (using tRPC Panel) on https://talkdash.fly.dev/trpc

### Frontend
- `cd frontend`
- Create a Cloudflare account (free) and add a new Cloudflare Pages project. Connect it to a GitHub repository.
- Optional: add a custom subdomain, for example, this project uses `talkdash.orth.uk`.
  - See https://developers.cloudflare.com/pages/platform/custom-domains/#disable-access-to-pagesdev-subdomain to make preview deployments private or to redirect example.pages.dev to your custom domain
- Run commands listed in `package.json`.
- Install [Solid Devtools chrome extension](https://chrome.google.com/webstore/detail/solid-devtools/kmcfjchnmmaeeagadbhoofajiopoceel). See more on https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#getting-started

### Backend
- cd `backend`
- Deployment
  - Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/)
  - Initialize project: `fly launch`
  - Set up for this project: Run `fly launch` in `backend/` giving it the name `talkdash`
  - deploy: run `fly deploy`
  - create env file: `cp backend/.env.example backend/.env`
  - Add secrets (`fly secrets set NAME=VALUE` for all the variables in `backend/.env`). For example, `fly secrets set CLOUDFLARE_WORKERS_AI_TOKEN='...'`
  - Deploy: `fly deploy`
- Reminders:
  - If you see `Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` when starting the backend, your local database might not set up.

## Notes about weird things
- I only installed husky because the `flyctl` CLI assumes you use it (possibly only for Node apps). Otherwise, `@flydotio/dockerfile` npm package fails to install with `sh: husky: command not found`.
  - I also need to `fly launch` in the root of the project, because husky relies on a git repo (can't be in a subdirectory).
- Turbo repo's `turbo.json` notes and issues:
  - Issue: [`globalDotEnv`](https://turbo.build/repo/docs/reference/configuration#globaldotenv) works, but a task specific [`dotEnv`](https://turbo.build/repo/docs/reference/configuration#dotenv) doesn't. Therefore, to be safe, I cause all apps to rebuild when the a environment variable that is used in the build changes.
    - It turns out I just misunderstood. The `dotEnv` path is relative to the "workspace", which is the **app** folder, **not** the repo root. I still need to define it, even when turbo detects `frontend/` is a vite project. It doesn't know to look in `.env` for environment variables.
  - Note: We don't rebuild the backend when the `.env` changes, because `.env` do not affect code generation. This is different in the frontend, where the variables are hardcoded into the JS bundle.
  - See https://turbo.build/repo/docs/core-concepts/caching/environment-variable-inputs for more information about environment variables.