FROM node:latest as build
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install
CMD [ "npm","run","start" ]