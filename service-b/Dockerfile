FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN apt-get update && apt-get install -y netcat

RUN npm install

COPY wait-for.sh ./
RUN chmod +x wait-for.sh

#COPY . .
COPY src/ ./src/
COPY protos/ ./protos/
RUN npm run build

EXPOSE 3001 50052

CMD ["./wait-for.sh", "rabbitmq:5672", "npm", "start"]