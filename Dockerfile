FROM node:22

WORKDIR /app

COPY package*.json vite.config.js index.html ./
RUN npm install && \
  # https://github.com/npm/cli/issues/4828
  npm install @rollup/rollup-linux-x64-gnu@4.19.0

COPY src/ ./src

EXPOSE 8080

ENTRYPOINT [ "npm", "run", "dev" ]
