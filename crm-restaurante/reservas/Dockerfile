FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY public ./public
COPY config.json ./config.json
ENV NODE_ENV=production DB_PATH=/data/reservas.db PORT=3100
VOLUME ["/data"]
EXPOSE 3100
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:3100/salud || exit 1
CMD ["node", "--disable-warning=ExperimentalWarning", "src/server.js"]
