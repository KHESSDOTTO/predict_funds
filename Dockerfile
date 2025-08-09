# syntax=docker/dockerfile:1

# Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=22.6.0
ARG PNPM_VERSION=9.12.3

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /app

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

# User non root for safety
RUN chown -R node:node /app
USER node

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy all other necessary files
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["pnpm", "run", "dev"]
