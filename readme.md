# Social Media Microservices Backend Project

## Description
This project consists of multiple microservices that work together to provide a comprehensive system. Each microservice is responsible for a specific domain and communicates with others through message queues (RabbitMq). The system is designed to be scalable, maintainable, and easy to deploy using Docker and Docker Compose.

## Table of Contents
- [Project Structure](#project-structure)
- [Services](#services)
  - [API Gateway](#api-gateway)
  - [Identity Service](#identity-service)
  - [Post Service](#post-service)
  - [Media Service](#media-service)
  - [Search Service](#search-service)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Build and Run the Services](#build-and-run-the-services)
- [Accessing the Services](#accessing-the-services)
- [Logs](#logs)


## Project Structure

## Services

### API Gateway
The API Gateway handles incoming requests and routes them to the appropriate microservice.

### Identity Service
The Identity Service manages user authentication and authorization.

### Media Service
The Media Service handles media uploads and storage.

### Post Service
The Post Service manages user posts, including creation, deletion, and retrieval.

### Search Service
The Search Service provides search functionality for posts.

## Tech Stack
- **TypeScript**: Programming language used for building the microservices.
- **Node.js**: JavaScript runtime for building scalable network applications.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing data.
- **Redis**: In-memory data structure store, used as a database, cache, and message broker.
- **RabbitMQ**: Message broker for communication between microservices.
- **Docker**: Platform for developing, shipping, and running applications in containers.
- **Docker Compose**: Tool for defining and running multi-container Docker applications.

## Prerequisites
- Docker
- Docker Compose
- Node.js
- npm

## Environment Variables
Each service has its own `.env` file for environment variables. Below are the common variables used across services:
- `PORT`: The port on which the service runs.
- `DATABASE_URL`: The MongoDB connection string.
- `REDIS_URL`: The Redis connection string.
- `RABBITMQ_URL`: The RabbitMQ connection string.
- `NODE_ENV`: The environment (development, production, etc.).

## Getting Started

### Clone the Repository
```sh
git clone  https://github.com/Aftab-alam-73/SocialMedia-Microservices-Backend-System.git

```
## Build and Run the Services
```sh
 docker-compose up --build 
 ```

 ## Accessing the Services
 The services can be accessed using their respective hostnames and ports:

 - API Gateway: http://localhost:3000
 - Identity Service: http://localhost:3001
 - Post Service: http://localhost:3002
 - Media Service: http://localhost:3003
 - Search Service: http://localhost:3004

 ## Logs
 Each service maintains its own logs:
 - combined.log: General logs.
 - error.log: Error logs.
 

 # Thank You.