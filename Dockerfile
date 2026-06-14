FROM node:22-alpine

RUN npm install -g pnpm@10

WORKDIR /app

# Copy workspace config and all package manifests first for better layer caching
COPY pnpm-workspace.yaml pnpm-lock.yaml .npmrc package.json ./
COPY artifacts/lbc-summit/package.json ./artifacts/lbc-summit/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/mockup-sandbox/package.json ./artifacts/mockup-sandbox/
COPY lib/db/package.json ./lib/db/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY scripts/package.json ./scripts/

RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Build the frontend, then the API server
RUN pnpm --filter @workspace/lbc-summit run build && \
    pnpm --filter @workspace/api-server run build

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
