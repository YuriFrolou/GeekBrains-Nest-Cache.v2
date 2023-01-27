FROM node

WORKDIR /app

COPY . .

RUN npm i @nx-tools/nx-docker

RUN npm install -g nx

RUN npm run build:web

EXPOSE 3002

CMD ["npm", "run","start:web"]
