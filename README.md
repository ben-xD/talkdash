# [TalkDash](https://talkdash.orth.uk)

Tools for event hosts and presenters, available on https://talkdash.orth.uk

Features:
- Show large (fullscreen) timer and timer on speaker screen
- Event hosts can text-message event speakers whilst they talk 
  - For example, "you have 10 minutes left" and remind them to "repeat the audience questions"
  - Messages are enhanced with Emojis using Cloudflare Workers AI
- Works offline 
  - On Chrome, you can install it
  - Some features require network connectivity (messaging)

## Technology
- Frontend: [Solid](https://tailwindcss.com/), [Solid Router](https://docs.solidjs.com/guides/how-to-guides/routing-in-solid/solid-router), [Tailwind](https://tailwindcss.com/), [ARK UI](https://ark-ui.com/) (headless UI library)
- Backend: Node, Fastify, tRPC and zod
  - Fastify for anything tRPC doesn't support: e.g. file uploads, 3rd party clients
  - Consider Supabase for extra *firebasy features*
  - Initially tried [Bun](https://bun.sh/) and [Bao](https://github.com/mattreid1/baojs)
    - Bao bun bug? Error: `TypeError: null is not an object (evaluating 'res.status')` internal to Bao, with no stack trace (Bun?). There was no way past this error, perhaps Bao is not compatible with the latest Bun. 
    - I wanted to use [Fastify](https://fastify.dev/) but Jarred said ['Fastify is not fast in bun.'](https://news.ycombinator.com/item?id=37800505).
    - Testing: [HTTPie](https://httpie.io/app) and [websocat](https://github.com/vi/websocat).
- Database: Postgres (Neon) and drizzle orm 
  - Temporarily disabled `trpc/context.ts` since I'm not persisting anything 
  - I don't really benefit from the "serverless" nature of Neon, since the backend is not serverless (because durable objects are not on the Cloudflare free tier, and also they tend to become expensive with use) 
  - However, I may use cloudflare workers in the future for other things, and using the neon serverless http API for that could be useful
- Deployment: [Fly.io](https://fly.io), [Cloudflare Pages, Cloudflare workers](https://www.cloudflare.com/en-gb/) (Fly.io for websocket connections, because Cloudflare Durable Objects are expensive)
  - Cloudflare pages build settings: 
    - Framework preset: `None`
    - Build command: `npm install -g turbo && turbo build`
    - Build output directory: `frontend/dist`
    - Extra environment variable: `VITE_BACKEND_URL=wss://talkdash.fly.dev`
    - Reminder: scale down to 1 machine using `flyctl scale count 1` because the backend is the message broker - we want all users connected to the same instance. See https://community.fly.io/t/how-deploy-to-just-one-machine/12510/2
  - Fly: 
    - Initialize project: `fly launch`
    - Add secrets: 
      - `fly secrets set CLOUDFLARE_WORKERS_AI_TOKEN='...'` taken from Cloudflare Workers AI.
      - `fly secrets set DATABASE_URL='...'` taken from Neon.tech (not currently necessary)
    - Deploy: `fly deploy`
- Image generated using [sdxl-emoji](https://replicate.com/fofr/sdxl-emoji), background removed using Modyfi.com, optimised with https://tinypng.com/, and favicons generated using https://realfavicongenerator.net/

## TODOs

- Add clock and stopwatch feature
- Zen mode
- View and adjust time remaining for the speaker remotely as Event Host
  - Keep timer working local-first (doesn't require connection)
  - Convert human-readable talk length into duration
- Bugs:
  - Can't click on mode buttons (Audience, Host) on mobile
- AI ideas:
  - record event host message from voice (STT) - whisper on Cloudflare - but won't be used at events to avoid distracing audience
  - Filter messages for safety and edit it for being funny - not really possible, Llama2 throws "ethics" error
  - Text-to-speech and add play button on speaker screen - elevenlabs code `ElevenLabsJam` - ElevenLabs is expensive
  - Group similar messages together. Store questions, and cluster based on category/relevance. Use Workers AI vectorize database? 
- Consider: SSR on Cloudflare pages

## Performance?
- Need performance? 
  - consider tRPC over uWebsockets, using https://github.com/romanzy313/trpc-uwebsockets?
  - consider [Elysia](https://elysiajs.com/) on Bun instead of tRPC on Node.

## Contributing
- Install nvm, run `nvm install` and `nvm use`
- Install pnpm: `npm install --global pnpm`
  - to upgrade, run `npm install --global --upgrade pnpm`
- Install turbo, run `pnpm install turbo --global`
- `pnpm i`

### Useful links
- API on https://talkdash.fly.dev
- API UI (using tRPC Panel) on https://talkdash.fly.dev/trpc

### Frontend
- `cd frontend`
- Run commands listed in `package.json`.

### Backend
- cd `backend`
- Deployment
  - Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/)
  - Set up for this project: Run `fly launch` in `backend/` giving it the name `talkdash`
  - deploy: run `fly deploy`

## Notes about weird things
- I only installed husky because the `flyctl` CLI assumes you use it (possibly only for Node apps). Otherwise, `@flydotio/dockerfile` npm package fails to install with `sh: husky: command not found`.
  - I also need to `fly launch` in the root of the project, because husky relies on a git repo (can't be in a subdirectory).
- Turbo repo's `turbo.json` notes and issues:
  - Issue: [`globalDotEnv`](https://turbo.build/repo/docs/reference/configuration#globaldotenv) works, but a task specific [`dotEnv`](https://turbo.build/repo/docs/reference/configuration#dotenv) doesn't. Therefore, to be safe, I cause all apps to rebuild when the a environment variable that is used in the build changes.
    - It turns out I just misunderstood. The `dotEnv` path is relative to the "workspace", which is the **app** folder, **not** the repo root. I still need to define it, even when turbo detects `frontend/` is a vite project. It doesn't know to look in `.env` for environment variables.
  - Note: We don't rebuild the backend when the `.env` changes, because `.env` do not affect code generation. This is different in the frontend, where the variables are hardcoded into the JS bundle.
  - See https://turbo.build/repo/docs/core-concepts/caching/environment-variable-inputs for more information about environment variables.