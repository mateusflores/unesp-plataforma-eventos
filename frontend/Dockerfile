FROM node:20-slim AS builder

ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_USE_MOCKS=false

WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json tsconfig.node.json vite.config.ts tailwind.config.js postcss.config.js index.html ./
COPY public/ ./public/
COPY src/ ./src/

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USE_MOCKS=$VITE_USE_MOCKS

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
