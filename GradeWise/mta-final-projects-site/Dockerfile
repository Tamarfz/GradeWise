# ----------- Build Stage -----------
FROM node:16-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# ----------- Production Stage -----------
FROM nginx:1.27.5

# Copy built React files
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# 🆕 Copy custom nginx.conf to handle React routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
