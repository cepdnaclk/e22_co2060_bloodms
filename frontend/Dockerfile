# Build stage
FROM node:20 AS build

WORKDIR /frontend
COPY package.json .
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/build ./build