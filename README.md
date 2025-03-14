# [TalkDash](https://talkdash.orth.uk)

Tools for event hosts and speakers, available on https://talkdash.orth.uk

## Features
- Show large (fullscreen) timer and timer on speaker screen
- Event hosts can text-message event speakers whilst they talk 
  - For example, "you have 10 minutes left" and remind them to "repeat the audience questions"
  - Messages are enhanced with Emojis using Cloudflare Workers AI
- Works offline (PWA)
  - On Chrome, you can install it
  - Some features require network connectivity (messaging, free text input)
- Timer, clock and stopwatch
- Time reminders for speaker (15 minutes, 5 minutes, 30 seconds and 0 seconds)
- Dark mode, light mode and system theme mode support
- Color schemes

## Technology

I used technologies that could be developed 100% locally. The only current exception is the API requests to text-generation APIs (OpenAI, Cloudflare and Mistral).
 
- Frontend: [Solid](https://tailwindcss.com/), [Solid Router](https://docs.solidjs.com/guides/how-to-guides/routing-in-solid/solid-router), [Tailwind](https://tailwindcss.com/), [ARK UI](https://ark-ui.com/) (headless UI library)
  - Support for [MDX](https://mdxjs.com/). For example, just import an `.mdx` file using `import About from "./About.mdx";` 
- Backend: Node, Fastify, tRPC and zod
  - Fastify is setup for anything tRPC doesn't support: e.g. file uploads, 3rd party clients, rigid authentication libraries
  - Authentication is done over tRPC procedures over websockets, without any 3rd party services, using [Lucia](https://lucia-auth.com/)
  - Initially tried [Bun](https://bun.sh/) and [Bao](https://github.com/mattreid1/baojs)
    - Bao bun bug? Error: `TypeError: null is not an object (evaluating 'res.status')` internal to Bao, with no stack trace (Bun?). There was no way past this error, perhaps Bao is not compatible with the latest Bun. 
    - I wanted to use [Fastify](https://fastify.dev/) but Jarred said ['Fastify is not fast in bun.'](https://news.ycombinator.com/item?id=37800505).
    - Testing: [HTTPie](https://httpie.io/app) and [websocat](https://github.com/vi/websocat).
    - Drizzle not generating any migration files when using bun. [GitHub issue](https://github.com/drizzle-team/drizzle-kit-mirror/issues/199)
  - APIs. Unauthenticated clients can connect to the websocket, use basic APIs, call the APIs to authenticate, and call authorized APIs.
    - All APIs support WebSocket
    - [Subscriptions](https://trpc.io/docs/subscriptions) (server sending messages to client) are not supported by the HTTP API
    - The API supports cookies and bearer token authentication based on the API request
- Database: Postgres (Neon, or a local postgres) and drizzle orm
  - Neon for production
    - Consider branching the production database and running locally (or in staging) to test features with real data. Consider using the [neon cli](https://neon.tech/docs/reference/neon-cli#connect)
  - [Supabase](https://supabase.com/) for development
    - create a project and get the connection string. Configure `DATABASE_URL` in GitHub repo secret and Fly secrets 
    - configure the backend application to use the connection string provided when running the previous command, by running `fly secrets set --app=talkdash-staging --stage DATABASE_URL=...`
  - Local postgres for local development
  - I don't really benefit from the "serverless" nature of Neon, since the backend is not serverless (because durable objects are not on the Cloudflare free tier, and also they tend to become expensive with use) 
  - However, I may use cloudflare workers in the future for other things, and using the neon serverless http API for that could be useful
  - Local postgres database is used locally
- Monorepo management: [Turborepo](https://turbo.build/repo) 
- Deployment: [Fly.io](https://fly.io), [Cloudflare Pages, Cloudflare workers](https://www.cloudflare.com/en-gb/) (Fly.io for websocket connections, because Cloudflare Durable Objects are expensive)
  - I get free Grafana dashboards and managed Prometheus. Dashboards are available for all fly apps on https://fly-metrics.net/
    - I also imported [Nodejs metrics dashboard](https://grafana.com/grafana/dashboards/11956-nodejs-metrics/) onto the Fly Grafana instance
  - The CI takes 58 seconds 🔥️🔥️ to build the frontend application and deploy to Cloudflare Pages from GitHub Actions. To build everything including backend docker image and deploying on Fly.io, it takes 2 minutes 10 seconds.
  - A PR will deploy a preview frontend application (but pointed to the staging backend)
  - An approval for the staging environment deployment (only on `main` branch) will deploy the frontend and backend to staging
  - An approval for the production environment (only on `main` branch) will deploy the frontend and backend to production
  - Create a pages project:
    - run `wrangler login` and login
    - run `npx wrangler pages project create talkdash`
      - Enter `main` as the production branch name
    - deploy the project, 
      - cd frontend
      - pnpm build
      - run `npx wrangler pages deploy dist`
  - Previously: Cloudflare Pages
    - The CI takes 1 minute 20 seconds 🔥️ to build the entire application and deploy to Cloudflare's data centers 
    - build settings: 
      - Framework preset: `None`
      - Build command: `npm install -g turbo && turbo build`
      - Build output directory: `frontend/dist`
      - Extra environment variable: `VITE_BACKEND_URL=wss://talkdash.fly.dev`
      - Reminder: scale down to 1 machine using `flyctl scale count 1` because the backend is the message broker - we want all users connected to the same instance. See https://community.fly.io/t/how-deploy-to-just-one-machine/12510/2
- Image generated using [sdxl-emoji](https://replicate.com/fofr/sdxl-emoji), background removed using Modyfi.com, optimised with https://tinypng.com/, and favicons generated using https://realfavicongenerator.net/
- OpenAI / GPT3.5 turbo: for converting text into durations (e.g. time for lunch -> 30 minutes) 
  - I use [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/) to measure the usage and cost of OpenAI API usage for this app
- Sentry for error reporting

## Contributing
- Install nvm, run `nvm install` and `nvm alias default` to set the default node version to the one in `.nvmrc`.
- Install pnpm: `npm install --global pnpm`
  - to upgrade, run `npm install --global --upgrade pnpm`
- Install turbo, run `pnpm install turbo --global`
- Install dependencies, run `pnpm install`

## Adding new environment variables
- Validate the environment variable exists in application code: add it to `env.ts` zod validator (either frontend or backend)
- add it to `.env` (either frontend or backend) so that it is available locally
- add it to `example.env` (either frontend or backend) so that it in a convenient template file
- If it's used in a build, add it to `turbo.json`'s `globalEnv` so that it is available in `turbo build`
- Make the variables available in CI: Add to all CI files: `pr.yml`, `staging.yml`, etc. so that CI will use it

### Useful links
 
- Application (PWA): https://talkdash.orth.uk/
  - Staging environment: https://staging.talkdash.pages.dev/ (same cloudflare project on `staging` "branch", but separate fly app, and separate database)
- API on https://talkdash.fly.dev
- API UI (using tRPC Panel) on https://talkdash.fly.dev/trpc (similar to Swagger UI, but for tRPC instead)

### Frontend
- `cd frontend`
- Create a GitHub and Cloudflare account (free)
- Configure GitHub repo secrets and environment variables:
  - Secrets:
    - Create Cloudflare API token from [your Cloudflare profile](https://dash.cloudflare.com/profile/api-tokens) and set it as `CLOUDFLARE_API_TOKEN`
    - Set `CLOUDFLARE_ACCOUNT_ID`, taken from the [Cloudflare Dashboard](https://dash.cloudflare.com/)
    - Create a Sentry auth token from [your Sentry account setting](https://orthuk.sentry.io/settings/auth-tokens/), and set it as `SENTRY_AUTH_TOKEN` 
  - Environment variables:
    - VITE_SENTRY_DSN
    - VITE_BACKEND_URL
- Previously: Create a Cloudflare account (free) and add a new Cloudflare Pages project. Connect it to a GitHub repository.
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
    - If you're deploying a lot, and have multiple environments,
      - remove the `app` from `fly.toml`
      - specify the app and staging flag when setting secrets to speed it up: `fly secrets set --app=talkdash-staging --stage CLOUDFLARE_ACCOUNT_ID=...`
      - redeploy the app: `pnpm run deploy:staging`
  - Deploy: `fly deploy`
- Reminders:
  - If you see `Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` when starting the backend, your local database might not set up.

## Notes about weird things
- I only installed husky because the `flyctl` CLI assumes you use it (possibly only for Node apps). Otherwise, `@flydotio/dockerfile` npm package fails to install with `sh: husky: command not found`.
  - I also need to `fly launch` in the root of the project, because husky relies on a git repo (can't be in a subdirectory).
- Turbo repo's `turbo.json` notes and issues:
  - Issue: [`globalDotEnv`](https://turbo.build/repo/docs/reference/configuration#globaldotenv) works, but a task specific [`dotEnv`](https://turbo.build/repo/docs/reference/configuration#dotenv) doesn't. Therefore, to be safe, I cause all apps to rebuild when an environment variable that is used in the build changes.
    - It turns out I just misunderstood. The `dotEnv` path is relative to the "workspace", which is the **app** folder, **not** the repo root. I still need to define it, even when turbo detects `frontend/` is a vite project. It doesn't know to look in `.env` for environment variables.
  - Note: We don't rebuild the backend when the `.env` changes, because `.env` does not affect code generation. This is different in the frontend, where the variables are written into the JS bundle.
  - See https://turbo.build/repo/docs/core-concepts/caching/environment-variable-inputs for more information about environment variables.
  - Turbo can have annoying bugs or features. Debug them using `turbo build --force --summarize --verbosity=2`
  - Allow JSON comments in Webstorm. Look for `Compliance with JSON standard` in Settings.
- I tried DaisyUI again for this project. It's API gets in the way. For example, I can't change CSS variables to affect the theme that Daisy UI uses. It doesn't really play well with Tailwind.
- PWA:
  - I needed to turn off Cloudflare web analytics, because this modified the `index.html` on every request, which meant the `index.html` hash changed on every request. The PWA thought there was a new version update, and notified the user whenever they visited the app.
    - Even after that change, browsers detected new versions because [`sw.js`](https://v2.talkdash.orth.uk/sw.js) kept changing between refreshes. See my [discord message](https://discord.com/channels/595317990191398933/789155108529111069/1185984798804672662).
  - Default Cloudflare behaviour was caching files, and may return old versions. This confuses PWAs into thinking there's a new version.
    - See [discord message](https://discord.com/channels/595317990191398933/1185984798804672662/1186421245475037214) for more information.
    - I've configured a new cache rule on Cloudflare, which bypasses cache when hostname contains `talkdash.orth.uk` called `Cloudflare Pages - TalkDash (including subdomains)`
- Sentry needs vite to output sourcemaps, but it doesn't delete them by default. This means your application source code is easily viewable in user's browser's devtools. Fine for open source projects, but less nice for closed source projects. This was fixed by configuring `sourcemap.filesToDeleteAfterUpload: ["**/*.js.map"]` in `vite.config.ts`.
- **tRPC websocket reconnection edge case:** My earlier implementation of authentication over websockets relied on clients calling a procedure for authentication (`trpc.auth.authenticateWebsocketConnection.mutate({})`) when they first sign-in, sign-up or start the app when already logged in. Future backend procedures accessed a `ctx.connectionContext` to get the user session.
  - However, when the user reconnects (when the backend restarts or client internet disconnected), the subscription is called *immediately* - we don't have the ability to send the `authenticateWebsocketConnection` request before this. In this edge case, `connectionContext` is missing (it makes sense because the user reconnected). 
    - **Cookies?:** If we used cookies, we could get the session when the client reconnects in the trpc createContext. However, we'd need to set both cookies and bearer token for the client in this case. This is because bearer token is nicer for websockets, since we can add authentication after the connection is made. 
    - Thankfully, the client input is available. I choose to add an extra parameter to each subscription procedure, which is the bearer token.
    - We still keep `trpc.auth.authenticateWebsocketConnection.mutate({})`, but use it for queries and mutations. Subscriptions get a `authToken` param.
    - Reminder: authenticated subscriptions should take an `authToken: z.string()` argument.
- to use github actions, I stopped using Cloudflare Pages. The CI in CLoudflare Pages is quite simple (no stages) or notifications. As soon as I wanted to mix it with GitHub Actions, I had to stop using Cloudflare Pages (it was auto triggering on any commit).
- To be able to have tests in the same folders as source code, I configured a few tsconfigs. 
  - I have 1 tsconfig that validates all source code. This ensures tests have proper typescript and type safety.
  - I tsconfig that extends the above tsconfig, and excludes the test files. This is used for builds. This ensure tests are not built in the output.
  - This is simpler than the `tsconfig.build.json` (for building) + `tsconfig.json` (for validation) [pattern](https://bobbyhadz.com/blog/typescript-exclude-test-files-from-compilation), where vite needs to be [configured](https://github.com/vitejs/vite/discussions/8483) to use `tsconfig.build.json` instead of `tsconfig.json`.
- Supabase
  - [defaults to not requiring SSL](https://supabase.com/docs/guides/platform/ssl-enforcement)
  - The SSL they use uses a self-signed certificate, and they provide a Root certificate to be added to your project or your machine.

## Useful
- Use [madge](https://github.com/pahen/madge) and graphviz to visualise relationships between files
- Capture exceptions or messages with Sentry: use `Sentry.captureException(err);` or `Sentry.captureMessage("Something went wrong");`
- For a simpler version of the app without authentication, see an old commit, `2b8e817ed448ee9f801e3efd7e6d4d520a0d9597`

## TODOs

- Fix tsconfig for tests in backend (test files are completely ignored and not typescript-checked)
