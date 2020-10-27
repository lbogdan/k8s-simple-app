FROM node:12.19.0-buster-slim

WORKDIR /app

COPY . .

CMD [ "node", "index" ]
