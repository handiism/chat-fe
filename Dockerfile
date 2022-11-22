FROM node:16-alpine AS builder

WORKDIR /chat
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.23.2-alpine
RUN rm -r /usr/share/nginx/html/*
COPY --from=builder /chat/build/.  /usr/share/nginx/html
