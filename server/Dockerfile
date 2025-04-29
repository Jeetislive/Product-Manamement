FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the port your Hapi.js server runs on (e.g., 3000)
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]