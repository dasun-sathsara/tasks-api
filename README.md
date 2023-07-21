# Tasks API

A REST API for managing tasks and users, built with TypeScript + Fastify + MongoDB.

## Description
This is a backend API for a task management application. It provides endpoints for user management (registration, login, etc.) as well as task CRUD operations.

## Features
* `TypeScript` types and interfaces
* `Fastify` for API routes and validation
* `MongoDB` for data storage
* `Typegoose` for defining MongoDB models/schemas
* `Zod` schema validation for requests
* JWT-based authentication
* Image upload and resizing with `Sharp`

## Docker
The API is dockerized using Docker Compose.

### Build images

```bash
docker-compose build
```

### Start containers
```bash
docker-compose up
```
This will start the API container along with a MongoDB container.

The API container runs the Fastify server on port 3001.



### Environment variables
Environment variables are loaded from the .env file. For Docker, variables can be set in the docker-compose.yml.

***Note***: I developed this project to learn more about TypeScript, Fastify, MongoDB and Docker.
