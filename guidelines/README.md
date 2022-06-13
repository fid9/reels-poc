# Nest.js Templates Guidelines

These templates allow you to get quickly started with Nest.js. They
contain several modules, helpers and concrete examples.

## Guidelines

Read more about Nest.js in the engineering-handbook [nestjs section](https://github.com/poviolabs/engineering-handbook/blob/master/code-guidelines/javascript/NestJS.md).

- [General](./General.md)
- [Packages](./Packages.md)
- [Tooling](./Tooling.md)
- [TypeORM](./TypeORM.md)


## Setting up a new project

Copy the root to a new project, along with the guidelines and schematics.

Schematics are extra pieces of code you can scaffold on top of the project. See [nest.js schematics](https://docs.nestjs.com/cli/usages#schematics).

Extra build in schematics:

- Flower App Example: `yarn generate flower-example`


## Template Maintainers

Marko Zabreznik
- email: marko.zabreznik(at)poviolabs.com
- github: https://github.com/marzab/


##  Changelog

### 1.0 (2021-04-16)

Moved modules to root, separated out guidelines.

### 1.2 (2021-08-03)

Moved main module to root, embeded schematics into template itself. Added VSCode dev-container. Upgraded nest.js and other packages.
