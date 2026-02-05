# Set the base image to Node 16
FROM node:18

# Update the repository sources list
RUN apt-get update && apt-get upgrade -y

# Install Tor
RUN apt-get install -y tor

# Set the working directory to /app
WORKDIR /app

# Bundle the app source inside the docker image
COPY . .

# Set app environment variables
ARG DEPLOYMENT_DOMAIN
ENV DEPLOYMENT_DOMAIN=${DEPLOYMENT_DOMAIN}
ARG UMAMI_ID
ENV UMAMI_ID=${UMAMI_ID}
ARG UMAMI_HOST
ENV UMAMI_HOST=${UMAMI_HOST}

# Set environment variables for Tor and Robosats Coordinator
ARG TOR_PROXY_SECRET
ENV TOR_PROXY_SECRET=${TOR_PROXY_SECRET}
ARG ROBOSATS_COORDINATOR_ONION_URL
ENV ROBOSATS_COORDINATOR_ONION_URL=${ROBOSATS_COORDINATOR_ONION_URL}
ARG TOR_SOCKS_URL
ENV TOR_SOCKS_URL=${TOR_SOCKS_URL}

# Install all the app npm packages
RUN npm install

# Build the nuxt app
RUN npm run build

# Bind docker daemon to port 8080
EXPOSE 8080

# Start Tor and the Node application
CMD service tor start && node .output/server/index.mjs
