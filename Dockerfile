FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
COPY . .
RUN npm install
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

RUN npm install --production

EXPOSE 8080
CMD ["node", "server.js"]
