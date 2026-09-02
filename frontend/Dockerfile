FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install dependencies (use legacy-peer-deps for React 19 compatibility)
RUN npm install --legacy-peer-deps

# Copy frontend source files
COPY . .

# Build Next.js frontend with backend proxy configuration
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV BACKEND_URL=http://backend:4029

RUN npm run build

# Production runner image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4028
ENV BACKEND_URL=http://backend:4029

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/image-hosts.config.mjs ./image-hosts.config.mjs

USER nextjs

EXPOSE 4028

CMD ["npx", "next", "start", "-p", "4028"]
