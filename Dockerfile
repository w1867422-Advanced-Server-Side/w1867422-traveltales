FROM ubuntu:latest
LABEL authors="Tharusha Peiris"

# Stage 1: install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: build image
FROM node:18-alpine
WORKDIR /app

# copy production deps
COPY --from=deps /app/node_modules ./node_modules
# copy source
COPY . .

# ensure .env is passed in at runtime (see below)
EXPOSE 3000

CMD ["node", "app.js"]