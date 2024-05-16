
#
# Builder
#
FROM node:18-alpine3.18 as builder

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci

RUN echo GENERATE_SOURCEMAP=false > .env

COPY tsconfig.json .
COPY public ./public
COPY src ./src
RUN npm run build

#
# Runtime
#
FROM node:18-alpine3.18

WORKDIR /app

RUN npm i -g http-server

COPY --from=builder /app/build /app/build

CMD ["http-server", "/app/build", "-p", "3000", "-d", "false", "-P", "http://localhost:3000?"]
EXPOSE 3000
