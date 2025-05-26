# Install dependencies only when needed
FROM node:18.19.0-alpine AS deps
WORKDIR /app
COPY . /app
RUN npm ci


# Rebuild the source code only when needed
FROM node:18.19.0-alpine AS builder
WORKDIR /app
COPY . .
RUN if [ -f .env.local ] && [ ! -f .env ]; then cp .env.local .env; fi
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM node:18.19.0-alpine AS build
WORKDIR /app
RUN apk update && apk upgrade && \
    apk add --no-cache bash git



# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/.aliases.js ./.aliases.js
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/build ./build
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

ARG DD_BRANCH_NAME
ENV DD_BRANCH_NAME $DD_BRANCH_NAME

# Run the datadog upload script
RUN node scripts/datadog/upload-sourcemaps.js branch=$DD_BRANCH_NAME

CMD ["npm","run", "serve"]
