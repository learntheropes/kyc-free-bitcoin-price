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
ARG ROBOSATS_COORDINATOR_ONION_URL
ENV ROBOSATS_COORDINATOR_ONION_URL=${ROBOSATS_COORDINATOR_ONION_URL}
# vs code complains about security for this but on Digital Ocean app I could not find any other way to espose it
ARG TOR_PROXY_SECRET
ENV TOR_PROXY_SECRET=${TOR_PROXY_SECRET}

# Install all the app npm packages
RUN npm install

# Build the nuxt app
RUN npm run build

# Bind docker daemon to port 8080
EXPOSE 8080

# Start Tor and the Node application
CMD ["sh", "-lc", "service tor start && exec node .output/server/index.mjs"]
