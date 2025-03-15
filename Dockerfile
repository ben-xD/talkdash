# Adapted from https://pnpm.io/docker
# To debug, build and enter the shell
# - build: `docker-compose up -d --build`
# - enter shell: `docker exec -it talkdash-backend-1 sh`

ARG NODE_VERSION=23.9.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="NodeJS"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install --global turbo
RUN corepack enable
WORKDIR /app
COPY backend backend
COPY packages packages
COPY pnpm-lock.yaml package.json turbo.json pnpm-workspace.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN turbo build

FROM base
WORKDIR /app/backend
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=prod-deps /app/backend/node_modules /app/backend/node_modules
COPY --from=build /app/backend/dist /app/backend/dist
EXPOSE 4000
CMD [ "pnpm", "start" ]