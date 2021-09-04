FROM node:14
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8010

CMD [ "node", "server.js" ]

