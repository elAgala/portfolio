# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS build

ARG VCS_REF=unknown

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run postinstall \
 && npm run generate

FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:daa17b944bac2b578e962da4c61ad72a59233b3c63abea17113acaf4e6b9aea4

ARG VCS_REF=unknown

LABEL org.opencontainers.image.title="Julián Benitez portfolio" \
      org.opencontainers.image.source="https://github.com/elAgala/portfolio" \
      org.opencontainers.image.revision="${VCS_REF}"

USER root
COPY deploy/nginx.conf /etc/nginx/nginx.conf
# Bake provenance into the image; runtime needs no writable configuration.
RUN printf '%s\n' "$VCS_REF" | grep -Eq '^[0-9a-f]{40}$' \
 && sed -i "s/__VCS_REF__/$VCS_REF/g" /etc/nginx/nginx.conf
COPY --from=build /workspace/.output/public /srv

USER 10001:10001

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1

# Bypass upstream entrypoint scripts: all configuration is prepared at build time.
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
