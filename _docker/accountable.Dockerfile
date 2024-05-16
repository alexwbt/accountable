
#
# Builder
#
FROM node:18-alpine3.18 as builder

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
COPY ./prisma ./prisma
RUN npm ci
RUN npx prisma generate

COPY ./src ./src
COPY ./tsconfig.json .
RUN npm run build

#
# Runtime
#
FROM node:18-alpine3.18

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
COPY ./prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate

COPY --from=builder /app/build .

ENTRYPOINT [ "node" ]
CMD [ "main.js" ]
