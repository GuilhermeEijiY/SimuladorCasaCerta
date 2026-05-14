FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

EXPOSE 3000

CMD ["npx", "nodemon", "--exec", "npx ts-node src/server.ts", "--ext", "ts"]
