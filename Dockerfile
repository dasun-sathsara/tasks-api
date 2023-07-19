FROM node:20.4.0 as builder

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn 

COPY . .

RUN npm run build

FROM node:20.4-slim

ENV NODE_ENV production

USER node

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install --production

COPY --from=builder /usr/src/app/dist ./dist

CMD [ "node", "dist/src/index.js" ]
