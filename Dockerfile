FROM node:alpine3.13 AS build-stage

# RUN npm install -g yarn
RUN apk update
RUN apk add git
RUN apk add python2
RUN apk add make
RUN apk add g++
RUN rm -rf /var/cache/apk/*

# RUN adduser -D -g '' user

# USER user

WORKDIR /app

# First copy the files needed for yarn install
COPY ./package.json .
COPY ./yarn.lock .
COPY ./packages/common/package.json ./packages/common/package.json
COPY ./packages/mockserver/package.json ./packages/mockserver/package.json
COPY ./packages/webcert/package.json ./packages/webcert/package.json

# Install all dependencies
RUN yarn install

# Copy the source
COPY . .

# Change to mockserver
WORKDIR /app/packages/webcert

RUN yarn build

# Make nginx image
FROM nginx:1.18.0

COPY --from=build-stage /app/packages/webcert/build/ /usr/share/nginx/html

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf