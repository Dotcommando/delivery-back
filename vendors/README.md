<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) based microservice `Vendors`. Uses Mongo DB in replica set mode from Docker Compose.

**Ports in use**: **27038**, **9003**.

Port 9003: _Vendors_ microservice.

Port 27038: _MongoDB_ in Docker in replica set mode.

## How to run

**First of all**, in current directory duplicate file `.env.sample` with name `.env`.

Vendors microservice:

```bash
# users
$ cd vendors
$ npm install
$ npm run generate:key
$ npm run db:up
$ npm run rs:init
$ npm run start:dev
```

## Mongo DSN

To have a look on Mongo DB collections:

    mongodb://appuser:Kvd0f6vzf240vjIS3Ls3@localhost:27038/delivery-vendors?authSource=admin&replicaSet=rs0

## Commands in Vendors microservice

Before the first run of replica set you should generate a key:

```bash
$ npm run generate:key
```

After key generation up the Docker Compose with Mongo in replica set mode:

```bash
$ npm run db:up
```

You can stop this service:

```bash
$ npm run db:stop
```

Or fully remove:

```bash
$ npm run db:rm
```

After you run DB with command `npm run db:up` you should initialize replica set mode:

```bash
$ npm run rs:init
```

To check if replica set is OK:

```bash
$ npm run rs:conf
```

## License

This is commercial software. All rights belong to Mikhail Filchushkin and the team.
