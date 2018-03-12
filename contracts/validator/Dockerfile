FROM node:9.8

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile \
    && yarn check --integrity \
    && yarn cache clean

COPY ./ ./

RUN yarn truffle compile
