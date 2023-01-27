FROM node:19 as build-stage

MAINTAINER GeekBrains <support@geekbrains.ru>

USER root

ENV APPLICATION_NAME=gb-demo-app

ENV SASS_BINARY_PATH=/opt/$APPLICATION_NAME/bin/vendor/linux-x64/binding.node

WORKDIR ./

COPY package.json package-lock.json ./

RUN npm ci

COPY ./ ./

#RUN npm run test

RUN npm run build

RUN npm prune --production

FROM node:12-alpine as production-stage

ENV APPLICATION_NAME=gb-demo-app

ENV NODE_ENV=production

WORKDIR /opt/$APPLICATION_NAME



