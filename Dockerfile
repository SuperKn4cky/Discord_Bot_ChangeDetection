FROM node:22.3.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

EXPOSE 5001

CMD ["node", "bot.js"]
