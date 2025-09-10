# Multi-stage build: builder runs install, build, and tests; runtime is slim.

FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci --include=dev

# Copy the rest of the project
COPY . .

# Build and test
RUN npm run build
RUN npm test


FROM node:20-alpine AS runtime
WORKDIR /app

# Copy only what's needed to run the CLI
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/bin ./bin

# Ensure bin scripts are executable
RUN chmod +x ./bin/parking_lot || true \
 && chmod +x ./bin/setup || true

# Use the CLI as the entrypoint; pass file path or use interactive input
ENTRYPOINT ["./bin/parking_lot"]

