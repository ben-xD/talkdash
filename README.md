# TalkDash

Tools for event hosts and presenters. 
- Available on https://talkdash.pages.dev. 
- API on https://talkdash.fly.dev.

- Message event speakers whilst they talk. Messages will appear on the app. For example, remind them to **repeat the question** asked by someone. 
- Adjust time remaining for the speaker remotely.

Still in development. It currently only shows the time elapsed and time remaining.

## Technology
- Frontend: [Solid](https://tailwindcss.com/), [Tailwind](https://tailwindcss.com/) and [Tanstack](https://tanstack.com/)
- Backend: Node
  - Initially tried [Bun](https://bun.sh/) and [Bao](https://github.com/mattreid1/baojs)
    - Bao bun bug? Error: `TypeError: null is not an object (evaluating 'res.status')` internal to Bao, with no stack trace (Bun?). There was no way past this error, perhaps Bao is not compatible with the latest Bun. 
    - I wanted to use [Fastify](https://fastify.dev/) but Jarred said ['Fastify is not fast in bun.'](https://news.ycombinator.com/item?id=37800505).
    - Testing: [HTTPie](https://httpie.io/app) and [websocat](https://github.com/vi/websocat).
- API: [ts-rest](https://ts-rest.com/) and [zod](https://zod.dev/)
- Deployment: [Fly.io](https://fly.io), [Cloudflare Pages, Cloudflare workers](https://www.cloudflare.com/en-gb/) (Fly.io for websocket connections, because Cloudflare Durable Objects are expensive)

## TODOs

- Add Node and tRPC backend over websockets.
- Add routing to frontend: https://github.com/solidjs/solid-router or tanstack router
- Bugs:
  - 2 minutes will briefly show as 1 minute 60 seconds
- AI ideas:
  - Convert human-readable talk length into duration.
  - Store questions, and cluster based on category/relevance. Use vectorize vector database.
  - Filter messages for safety.

## Performance?
- Need performance? 
  - consider tRPC over uWebsockets, using https://github.com/romanzy313/trpc-uwebsockets?
  - consider [Elysia](https://elysiajs.com/) on Bun instead of tRPC on Node.

## Contributing
- Install nvm, run `nvm install` and `nvm use`
- Install pnpm: `npm install --global pnpm`
- `pnpm i`

### Frontend
- `cd frontend`
- Run commands listed in `package.json`.

### Backend
- cd `backend`
- Deployment
  - Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/)
  - Set up for this project: Run `fly launch` in `backend/` giving it the name `talkdash`
  - deploy: run fly deploy