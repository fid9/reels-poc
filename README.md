[//]: # (Replace this section with the project intro.)

# Nest.js Templates Guidelines

These templates allow you to get quickly started with Nest.js. They
contain several modules, helpers and concrete examples. See [guidelines](./guidelines/README.md) for instructions.

[//]: # (End Intro)


# Tooling

## Environment

```bash
yarn install
```

Prepare a `.env.local` file from `.env.local.example`.

```bash
# local development in watch mode
$ yarn run start:dev

# local `dist` mode
$ yarn run start:prod
```

## Tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

