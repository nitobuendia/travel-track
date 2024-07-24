FROM node:22

WORKDIR /app

COPY package*.json vite.config.js index.html ./
RUN npm install && \
  npm install -g serve@14.2.3 && \
  # https://github.com/npm/cli/issues/4828
  npm install @rollup/rollup-linux-x64-gnu@4.19.0

COPY src/ ./src
RUN npm run build

EXPOSE 3000
ENTRYPOINT [ "serve", "-s", "dist" ]
