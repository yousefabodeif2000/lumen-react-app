# Use official Node.js image
FROM node:20

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if any)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Copy tsconfig.json if you have it
COPY tsconfig.json ./

# Copy .env file (optional if you mount it via docker-compose)
# You can remove this if you use docker-compose env_file mount
# COPY .env .env

# Install ts-node and TypeScript globally
RUN npm install -g ts-node typescript

# Expose Node port
EXPOSE 3000

# Start the Node app using ts-node
CMD ["npx", "ts-node", "src/server.ts"]
