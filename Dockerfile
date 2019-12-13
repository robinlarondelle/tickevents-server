FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER root

ENV NODE_ENV=development

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD ["npm", "start"]