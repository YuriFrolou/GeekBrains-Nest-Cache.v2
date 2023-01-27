FROM node

WORKDIR /app

COPY . .
RUN npm i @nx-tools/nx-docker
RUN npm install -g nx

RUN npm run build:api

CMD ["npm", "run","start:api"]
