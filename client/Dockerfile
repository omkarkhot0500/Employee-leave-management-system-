# Build phase
FROM node:18 as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source & build it
COPY . .
ARG VITE_API_URL
RUN echo "VITE_API_URL=$VITE_API_URL" > .env
RUN npm run build

# Production phase: use lightweight NGINX image
FROM nginx:alpine

# Copy build output to NGINX public dir
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
