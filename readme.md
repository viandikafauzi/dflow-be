# Simple Web App - Backend

Backend apps for handling basic RESTful API request. Created using expressJS & mongoDB.

## Features

- request validation
- reset/forgot password token auto expiration
- custom error handler

## Installation

For the apps to work, please provide .env file that provide parameter below:

```sh
NODE_ENV = <your environment (development/production)>
PORT = <port for your apps to run>
MONGO_CONNECT = <mongo URI connect>
JWT_SECRET = <your JWT secret>
FE_URL = <Frontend URL to handle mail link. Ex: localhost:3000>
```

Run this command for first time run:

```sh
$ yarn install
$ yarn start
```

Or if you use NPM:

```sh
$ npm install
$ npm start
```

## Postman Collection

You can check the postman collection [here](https://www.getpostman.com/collections/dbb313b1ed573d4f474e). It's available on the repo too.
