# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS build

ARG VCS_REF=unknown

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run postinstall \
 && npm run generate

FROM caddy:2-alpine

ARG VCS_REF=unknown

LABEL org.opencontainers.image.title="Julián Benitez portfolio" \
      org.opencontainers.image.source="https://github.com/elAgala/portfolio" \
      org.opencontainers.image.revision="${VCS_REF}"

ENV XDG_CONFIG_HOME=/tmp/caddy/config \
    XDG_DATA_HOME=/tmp/caddy/data

COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /workspace/.output/public /srv

USER 10001:10001

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
