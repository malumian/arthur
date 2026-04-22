---
title: NGINX and Docker
date: 2025-01-15
tags: ['programming']
---

In this article, I will share how to configure and use Docker and NGINX for both frontend and backend applications, providing a step-by-step approach for development and production environments.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Docker](#docker)
  - [Command Line Instructions](#command-line-instructions)
  - [Backend](#backend)
    - [Dockerfile.dev](#dockerfiledev)
    - [Dockerfile.prod](#dockerfileprod)
    - [.env](#env)
    - [.dockerignore](#dockerignore)
  - [Frontend](#frontend)
    - [Dockerfile.dev](#dockerfiledev-1)
    - [Dockerfile.prod](#dockerfileprod-1)
    - [nginx.conf](#nginxconf)
    - [vite.config.js](#viteconfigjs)
    - [.dockerignore](#dockerignore-1)
  - [docker-compose.yml](#docker-composeyml)
    - [docker-compose.dev.yml](#docker-composedevyml)
    - [docker-compose.prod.yml](#docker-composeprodyml)
- [NGINX](#nginx)
  - [Command Line Instructions](#command-line-instructions-1)
  - [nginx.conf](#nginxconf-1)
  - [default or example.com.conf](#default-or-examplecomconf)
    - [default](#default)
    - [example.com.conf](#examplecomconf)
- [Next Steps](#next-steps)
- [Links](#links)

## Docker

For simplicity, I won’t fill the article with the actual application code. Instead, I’ll provide the locations of the relevant files discussed below. I will be using React (Vite) and Express, but this configuration will be suitable for most languages, with differences only in specific commands or package managers.

Here’s the project structure:

```plaintext
application/
├── frontend/
│   ├── .dockerignore
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── nginx.conf
│   └── vite.config.js
├── backend/
│   ├── .dockerignore
│   ├── .env.dev
│   ├── .env.prod
│   ├── Dockerfile.dev
│   └── Dockerfile.prod
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

### Command Line Instructions

The following commands are commonly used for managing Docker images and containers:

- `docker image ls` — Lists available Docker images.
- `docker ps` — Displays running containers.
- `docker ps -a` — Lists all containers, including stopped ones.

To build and run images:

- `docker build -t <image name> .` — Builds an image with a specific name.
- `docker run -p <host-port:container-port> --name <container-name> <image name or ID>` — Runs a container with port mapping.

Managing containers:

- `docker stop <container name or ID>` — Stops a running container.
- `docker start <container name or ID>` — Starts an existing container.

Accessing container logs and shell:

- `docker exec -it <container name or ID> /bin/sh` — Opens a shell in the running container.
- `docker logs <container name or ID>` — Displays container logs.

For multi-container setups:

- `docker compose up --build` — Builds and starts containers defined in `docker-compose.yml`.
- `docker compose -f <docker-compose file name> up --build` — Uses a specific compose file for production. Add `-d` to run in the background.

_Note: Replace values inside `<>` with the actual name, ID, or value as required._

### Backend

The main difference between `Dockerfile.dev` and `Dockerfile.prod` lies in optimization for development and production stages. In `Dockerfile.prod`, we apply the following optimizations:

1. The `--omit=dev` flag is used with `npm install` to exclude development dependencies, reducing the final image size.
2. The startup command is changed from `npm run dev` to `npm run start`, ensuring the application runs in production mode. When using `npm run dev`, the application is started with `nodemon`, which automatically restarts the server upon detecting changes in the source code, making it ideal for development. In contrast, `npm run start` runs the application with the standard `node` command, suitable for production where frequent restarts are unnecessary, ensuring a more stable and efficient environment.

#### Dockerfile.dev

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

#### Dockerfile.prod

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
```

#### .env

Make sure to create `.env` files in backend directory for both development and production.

**Development (`.env.dev`)**:

```dotenv
NODE_ENV=development
PORT=3000
```

**Production (`.env.prod`)**:

```dotenv
NODE_ENV=production
PORT=3000
```

#### .dockerignore

A `.dockerignore` file helps to exclude unnecessary files from being copied into the Docker image, reducing its size and build time. Here's a typical `.dockerignore` file:

```plaintext
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
.env*
```

### Frontend

Just like the backend, we create separate Dockerfiles for development and production in the frontend.

#### Dockerfile.dev

This file sets up a development environment with hot-reloading enabled for React (Vite):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
```

#### Dockerfile.prod

The production Dockerfile involves a two-stage build process:

- Build. This stage compiles the frontend application using the specified environment variables.
- Production. The compiled assets are copied into an NGINX container to serve the static files efficiently.

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.23-alpine AS production

RUN rm -rf /usr/share/nginx/html/50x.html

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

Basic NGINX configuration for a SPA application.

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

#### vite.config.js

When running React (Vite) apps inside Docker, it’s important to configure the Vite server correctly for development mode:

```js
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
});
```

These parameters are necessary to ensure the correct functioning of a Vite application inside a Docker container:

- `host: '0.0.0.0'` — makes the application accessible from outside the container.
- `port: 5173` — explicitly specifies the port to be exposed.
- `watch: { usePolling: true }` — solves file change detection issues inside the container, ensuring HMR works properly.

#### .dockerignore

Same as before:

```plaintext
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
.env*
```

### docker-compose.yml

Using `docker-compose.yml` simplifies managing multiple services, such as the backend and frontend, by defining them in a single file. Below are separate configurations for development and production.

#### docker-compose.dev.yml

```yml
services:
  backend:
    image: backend-dev
    pull_policy: never # Image pull policy — do not pull from a registry, use the local image
    container_name: backend-dev-container
    env_file: ./backend/.env.dev
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - 3000:3000
    volumes:
      - ./backend:/app # Mounting the local code directory into the container for development
      - /app/node_modules # Excluding node_modules from mounting to use container-specific dependencies
    networks:
      - app-network

  frontend:
    image: frontend-dev
    pull_policy: never # Image pull policy — do not pull from a registry, use the local image
    container_name: frontend-dev-container
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    environment:
      VITE_API_URL: http://localhost:3000
    ports:
      - 5173:5173
    volumes:
      - ./frontend:/app # Mounting the local code directory into the container for development
      - /app/node_modules # Excluding node_modules from mounting to use container-specific dependencies
    depends_on:
      - backend # Dependency on the 'backend' service, ensuring the backend starts before the frontend
    networks:
      - app-network

networks:
  app-network: # Definition of a custom network
    driver: bridge
```

#### docker-compose.prod.yml

```yml
services:
  backend:
    image: backend
    pull_policy: never # Image pull policy — do not pull from a registry, use the local image
    container_name: backend-container
    env_file: ./backend/.env.prod
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - 3030:3000
    volumes:
      - ./backend/uploads:/app/uploads # If you need some directory to share between container and host machine
    restart: always # Always restart the container if it stops
    networks:
      - app-network

  frontend:
    image: frontend
    pull_policy: never # Image pull policy — use the local image, do not pull from a registry
    container_name: frontend-container
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        VITE_API_URL: http://api.example.com
    ports:
      - 3031:80
    restart: always # Always restart the container if it stops
    depends_on:
      - backend # Dependency on the 'backend' service, ensuring the backend starts before the frontend
    networks:
      - app-network

networks:
  app-network: # Definition of a custom network
    driver: bridge
```

**Important clarification.** Notice that in the frontend development environment, I pass environment variables through `environment`, but in the production environment, I pass them through build arguments (`args`). Why is that?

In development, environment variables can be dynamic and change their values while the application is running, which is convenient for frequent changes and testing.

In production, values are usually fixed during the build process, as the application will run in a stable environment, and any changes should require rebuilding the container.

Here’s how it’s connected:

For frontend applications built with tools like Vite, variables such as the API URL in my case need to be passed through `args` so they are embedded into the compiled code during the build stage. If you use `environment`, the variable will only be available after the container starts, which is more suitable for a development environment.

Therefore, if you want the variable to be embedded in the static code during the build stage, it's better to use `args`.

## NGINX

Once you have rented a server, installed Git, Docker, NGINX, cloned your project from GitHub, and started the Docker containers, you can begin configuring NGINX.

The core idea is that NGINX will proxy requests to locally running servers. This means that NGINX will receive incoming HTTP requests and forward them to your backend or frontend services running locally, based on the rules defined in the NGINX configuration.

Here’s the NGINX directory structure:

```plaintext
/etc/nginx/
├── sites-available/
│   ├── default
│   └── example.com.conf
├── sites-enabled/
│   ├── default@ -> /etc/nginx/sites-available/default
│   └── example.com.conf@ -> /etc/nginx/sites-available/example.com.conf
└── nginx.conf
```

- `sites-available/` contains configuration files for each website or service you want to configure. These files are not active until linked to `sites-enabled/`.
- `sites-enabled/` contains symbolic links (`ln -s`) to the configuration files in `sites-available/`, which make them active.
- `nginx.conf` is the main configuration file where global settings and directives are specified.

### Command Line Instructions

The following are commonly used `systemctl` commands to manage the NGINX service:

```bash
systemctl start|reload|restart|stop|status nginx
```

- `start` — Starts the NGINX service.
- `reload` — Reloads the NGINX service to apply changes in configuration without restarting the service.
- `restart` — Restarts the NGINX service, which is useful when changes are made that require a full restart.
- `stop` — Stops the NGINX service.
- `status` — Displays the current status of the NGINX service, including whether it's running or not.

### nginx.conf

This is the general configuration file for NGINX. Below is an example of a basic setup:

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;
include /etc/nginx/modules-enabled/*.conf;

events {
  worker_connections 768;
}

http {

  ##
  # Basic Settings
  ##

  sendfile on;
  tcp_nopush on;
  types_hash_max_size 2048;

  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  ##
  # SSL Settings
  ##

  ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
  ssl_prefer_server_ciphers on;

  ##
  # Logging Settings
  ##

  access_log /var/log/nginx/access.log;

  ##
  # Gzip Settings
  ##

  gzip on;

  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_buffers 16 8k;
  gzip_http_version 1.1;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

  ##
  # Proxy Path
  ##

  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=100m inactive=60m use_temp_path=off;

  ##
  # Virtual Host Configs
  ##

  include /etc/nginx/sites-enabled/*;
}
```

- The `http` block contains most of the configuration related to handling HTTP traffic, including settings for SSL, logging, compression (gzip), and proxy caching.
- The `include /etc/nginx/sites-enabled/*;` directive tells NGINX to include all configurations from `sites-enabled/`, effectively enabling the configurations for your sites.

### default or example.com.conf

Here are two examples of NGINX configuration files. The first one is for a setup where you have specific domain (`example.com`), while the second one is for a setup where you might not have a domain but still want to proxy traffic.

#### default

This configuration might be used when you're setting up a service without a domain.

```nginx
server {
  listen 8080;

  location / {
    proxy_pass http://localhost:3030;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}

server {
  listen 8081;

  location / {
    proxy_pass http://localhost:3031;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_cache my_cache;
    proxy_cache_valid 200 301 302 10m;
    proxy_cache_valid 404 1m;
    add_header X-Cache-Status $upstream_cache_status;
  }
}
```

In this case, In the `docker-compose.prod.yml` file, you need modify environment variables under `frontend > build > args` to specify values such as the API URL for the production environment. This ensures that when the frontend is built, the correct API endpoint is set.

```yml
args:
  VITE_API_URL: http://<IP of your server>:8080
```

#### example.com.conf

This configuration is useful if you have specific domain (`example.com`) for your services.

```nginx
server {
  listen 80;
  server_name api.example.com;

  location / {
    proxy_pass http://localhost:3030;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}

server {
  listen 80;
  server_name example.com;

  location / {
    proxy_pass http://localhost:3031;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_cache my_cache;
    proxy_cache_valid 200 301 302 10m;
    proxy_cache_valid 404 1m;
    add_header X-Cache-Status $upstream_cache_status;
  }
}
```

You need create a symbolic link to this file in `sites-enabled/` to activate it:

```bash
ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/
```

## Next Steps

After setting up Docker and NGINX, you may want to add HTTPS support. One popular and free solution is Certbot by Let’s Encrypt, which automates the process of obtaining and renewing SSL/TLS certificates. Ensure that your domain is correctly pointed to your server before running Certbot.

## Links

- [Docker](https://www.docker.com/)
- [NGINX](https://nginx.org/en/)
- [Certbot](https://certbot.eff.org/)
