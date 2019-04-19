FROM node:alpine

WORKDIR /usr/app

COPY server/package.json .

RUN npm install

COPY app-chat/dist/app-chat web

COPY server .

EXPOSE 3000
CMD ["npm","start"]