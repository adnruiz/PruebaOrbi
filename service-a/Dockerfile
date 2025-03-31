FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
#COPY config/ ./config./

RUN npm install

COPY src/ ./src/
COPY protos/notification.proto ./protos/

RUN apt-get update && apt-get install -y netcat

COPY wait-for.sh ./
RUN chmod +x wait-for.sh

RUN npm run build

EXPOSE 3000 50051

CMD ["./wait-for.sh", "npm", "start"]