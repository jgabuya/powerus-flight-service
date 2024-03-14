# Flight Service

## Description

This service provides flight information, which it retrieves from various external sources. To optimize performance and minimize response times, it leverages Redis for data caching. The cache has a Time-To-Live (TTL) of 1 hour.

<div align="center">
	<code><img width="40" src="https://github.com/marwin1991/profile-technology-icons/assets/136815194/519bfaf3-c242-431e-a269-876979f05574" alt="Nest.js" title="Nest.js"/></code>
	<code><img width="40" src="https://user-images.githubusercontent.com/25181517/182884894-d3fa6ee0-f2b4-4960-9961-64740f533f2a.png" alt="redis" title="redis"/></code>
	<code><img width="40" src="https://user-images.githubusercontent.com/25181517/187955005-f4ca6f1a-e727-497b-b81b-93fb9726268e.png" alt="Jest" title="Jest"/></code>
</div>

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
