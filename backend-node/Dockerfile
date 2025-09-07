FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Install ts-node globally
RUN npm install -g ts-node typescript

EXPOSE 3000

CMD ["ts-node", "server.ts"]
