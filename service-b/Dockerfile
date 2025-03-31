FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN apt-get update && apt-get install -y netcat

COPY wait-for.sh ./
RUN chmod +x wait-for.sh

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001 50052

CMD ["./wait-for.sh", "npm", "start"]