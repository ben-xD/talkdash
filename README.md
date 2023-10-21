# TalkDash

Tools for event hosts and presenters. 
- Available on https://talkdash.pages.dev. 
- API on https://talkdash.fly.dev.

- Message event speakers whilst they talk. Messages will appear on the app. For example, remind them to **repeat the question** asked by someone. 
- Adjust time remaining for the speaker remotely.

Still in development. It currently only shows the time elapsed and time remaining.

## Technology
- Frontend: [Solid](https://tailwindcss.com/), [Tailwind](https://tailwindcss.com/) and [Tanstack](https://tanstack.com/)
- Backend: [Fastify](https://fastify.dev/) and [Bun](https://bun.sh/) (i initially tried [bao](https://github.com/mattreid1/baojs) instead of Fastify - it had a few unintuitive bugs).
- API: [ts-rest](https://ts-rest.com/) and [zod](https://zod.dev/)
- Deployment: [Fly.io](https://fly.io), [Cloudflare Pages, Cloudflare workers](https://www.cloudflare.com/en-gb/) (Fly.io for websocket connections, because Cloudflare Durable Objects are expensive)

## TODOs

- Bugs:
  - 2 minutes will briefly show as 1 minute 60 seconds
- AI ideas:
  - Convert human-readable talk length into duration.
  - Store questions, and cluster based on category/relevance. Use vectorize vector database.
  - Filter messages for safety.

## Contributing
- Install nvm, run `nvm install` and `nvm use`
- Install pnpm: `npm install --global pnpm`
- `pnpm i`

### Frontend
- `cd frontend`
- Run commands listed in `package.json`.

### Backend
- cd `backend`
- Install node specified in `.node-version`
- Install bun: run `curl -fsSL https://bun.sh/install | bash`
- Deployment
  - Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/)
  - Set up for this project: Run `fly launch` in `backend/` giving it the name `talkdash`
  - deploy: run fly deploy