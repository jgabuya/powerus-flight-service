# Flight Service

## Description

This service provides flight information, which it retrieves from various external sources. To optimize performance and minimize response times, it leverages Redis for data caching. The cache has a Time-To-Live (TTL) of 1 hour.

It's built with Nest.js and uses Jest for testing.

## Getting Started

```bash
# clone the repository
git clone <repository-url>

# navigate to the project directory
cd <project-directory>

# install dependencies
npm install

# copy the .env.example file to .env and edit the values accordingly
cp .env.example .env
```

Note: A running Redis server is required for the application to function. If you have Docker installed, you can start a Redis server using the following command:

```bash
docker run --name my-redis -d -p 6379:6379 redis
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
