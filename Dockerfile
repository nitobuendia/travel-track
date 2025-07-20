FROM node:22

WORKDIR /app

COPY package*.json vite.config.js index.html ./
RUN npm install && \
    npm install -g serve@14.2.3

COPY src/ ./src
RUN npm run build

EXPOSE 3000
ENTRYPOINT [ "serve", "-s", "dist" ]
