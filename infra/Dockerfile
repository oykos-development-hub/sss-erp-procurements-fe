# Select base image
FROM node:18 as build

# Set working directory in the container
WORKDIR /app

# Use environment variables in GitLab CI/CD
ARG GITLAB_CLIENT_LIBRARY
ARG GITLAB_RAT

ENV GITLAB_CLIENT_LIBRARY=$GITLAB_CLIENT_LIBRARY
ENV GITLAB_RAT=$GITLAB_RAT

# Disable SSL verification for git
ENV GIT_SSL_NO_VERIFY=true

# Copy the entire repository
COPY . .

# Run the setup.js script
RUN npm run setup

# Build the application
RUN npm run build

# Use Nginx as the production server
FROM nginx:alpine

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 443 for the Nginx server
EXPOSE 80
