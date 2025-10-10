FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src src
RUN npm run build

FROM node:20-alpine AS final

WORKDIR /usr/src/app

ENV NODE_ENV=production
COPY package*.json ./
RUN npm install

COPY --from=build /usr/src/app/dist/ dist/

EXPOSE 1127

CMD [ "node", "dist/index.js" ]