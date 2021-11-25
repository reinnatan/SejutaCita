#FROM alpine:latest
#RUN apk add --update nodejs npm
FROM node:latest
WORKDIR /app
COPY . /app
COPY package.json /app
RUN npm install
EXPOSE 3030
CMD ["node", "index.js"]