FROM node:22-alpine

RUN npm install -g pnpm@10

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/lbc-summit run build

RUN pnpm --filter @workspace/api-server run build

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
