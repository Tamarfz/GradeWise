# Multi-Stage Dockerfile

# Stage 1: Build the Node.js Application
FROM node:16-alpine AS node-build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the React app
RUN npm run build


# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files from the node-build stage
COPY --from=node-build /usr/src/app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
