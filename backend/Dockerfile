# Stage 1: Build the application (Uses a slightly larger image for building, based on Debian Slim)
FROM node:20-slim AS build 

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


FROM node:20-slim AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

RUN npm prune --production


COPY --from=build /app/dist ./dist


RUN adduser --system --group nestjs
USER nestjs

EXPOSE 3001

CMD ["node", "dist/main"]