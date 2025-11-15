# backend/Dockerfile
FROM node:18-slim

WORKDIR /app

# copy package files first for caching
COPY package*.json ./

RUN npm install --production

COPY . .

ENV PORT=3000

EXPOSE 3000
CMD ["npm", "start"]
