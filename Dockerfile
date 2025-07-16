# Use official Node.js image for build
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

# Use official Nginx image for serving static files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
