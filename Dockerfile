# ===== DOCKERFILE – sincore =====
# Multi-stage build: buduje aplikację i tworzy lekki obraz produkcyjny

# --- ETAP 1: Instalacja zależności ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# --- ETAP 2: Build aplikacji ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Wyłącza telemetrię Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# --- ETAP 3: Obraz produkcyjny (lekki) ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
