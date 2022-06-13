
## Resource naming

There is a certain art in naming resources appropriately. Take the next
points with a grain of salt:

- **How data is presented to the user should not take precedence to common
  conventions on the backend**. The frontend will change, and it will be
  translated.

- **Optimize names but have very verbose comments**. Having a unique
  name for a module/entity works great but make the name discoverable
  with a comment.


- **Do not use combined words**. Instead of "PersonEvent" use a unique
  name like Enrollment - but make a comment that describes the combination.

- **Use positive terms**. Negatives can get confusing, stick with isDefined
  and shouldWork instead of isNotDefined or notDisabled

### Implicit Naming (REST Compatible)

This layout should be used by default. Each Entity is in the root and
its related entities follow the id of the instance they relate to.

| Controller               | DTO                      |  Resource URI                                   | Usage                                   |
|:-------------------------|:-------------------------|:------------------------------------------------|:----------------------------------------|
| `usersList`              | `user.query.dto.ts`      |  `GET:/users?filters[name]=marko&order=+name`   |   listing (filtering) entities          |
| `userDetail`             | `user.detail.dto.ts`     |  `GET:/users/:userId `                          |   entity details                        |
| `userCreate`             | `user.create.dto.ts`     | ` POST:/users    `                              |   creating a new entity                 |
| `userUpdate`             | `user.update.dto.ts`     |  `PUT:/users/:userId`                           |   updating en entity                    |
| `userDelete`             | `user.delete.dto.ts`     |  `DELETE:/users/:userId`                        |   deleting en entity                    |
| `userPetList`            | `user-pet.query.dto.ts`  |  `GET:/users/:userId/pets`                      |   listing (filtering) related entities  |
| `petsList`               | `pet.query.dto.ts`       |  `GET:/user-pets`                               |   listing (filtering) entities          |

### Explicit Naming

This layout should be used when we need strict namespacing due to a
complex router setup. Each module is in the root and exposes their
entities in the second level. There should be no overlapping routes.

| Controller               | DTO                      |  Resource URI                                   | Usage                                   |
|:-------------------------|:-------------------------|:------------------------------------------------|:----------------------------------------|
| `usersList`              | `user.query.dto.ts`      |  `GET:/users/list?filters[name]=marko`          |   listing (filtering) entities          |
| `userDetail`             | `user.detail.dto.ts`     |  `GET:/users/user/:userId `                     |   entity details                        |
| `userCreate`             | `user.create.dto.ts`     | ` POST:/users/create-user    `                  |   creating a new entity                 |
| `userUpdate`             | `user.update.dto.ts`     |  `PUT:/users/user/:userId`                      |   updating en entity                    |
| `userDelete`             | `user.delete.dto.ts`     |  `DELETE:/users/user/:userId`                   |   deleting en entity                    |
| `userPetList`            | `user-pet.query.dto.ts`  |  `GET:/users/user/:userId/pets`                 |   listing (filtering) related entities  |
| `petsList`               | `pet.query.dto.ts`       |  `GET:/users/pets/list`                         |   listing (filtering) entities          |

## File structure

`.yarn` - persisted and git versioned packages

`dist` - where the project is build

`node_modules` - local nodejs package cache

`src/common` - Code shared among all modules

`src/common/exceptions` -  Generic and project specific exceptions

`src/common/handlers` - Generic API endpoint handlers and logging helpers

`src/modules` - Project specific modules (code grouped by usage or other criteria)

`src/modules/app` - The main app module

`src/entities` - Database entities (TypeORM)

`src/utils` - Helpers that can be freely shared between projects and do
  not contain any business logic

`utils` - helpers for testing and deploying the code


## Module structure

###  \[module_name\].module.ts

The main module, linking together the services and controllers.

###  \[module_name\].service.ts

A Service should perform specific actions by input, regardless
of who the user or controller that called the function.

A Service should contain Business logic but should:

- not contain any database SQL code (except for non-database specific
  calls like TypeORM helpers).

- not accept or return any DTO, instead, it should always return
  internal Models

- not contain any request specific code that changes based on permissions

###  \[module_name\].controller.ts

A controller is the glue between an endpoint and a service. It should:

- Check permissions and call the appropriate service

- Convert a service response (that should be in an internal structure) to
  a DTO. The DTO should be placed inside a `dto` folder inside the module.

###  \[module_name\].repository.ts

A repository is the glue between a service and an persistence layer. It should:

- contain database specific code, including SQL and ORM methods

- include other repositories as needed (relational databases do this implicitly)

- not include any services or higher layers

- not include business logic

###  dto/\[model_name\].\[action\].dto.ts

A dto file should contain a single dto that can contain Class-Validator
decorators.

## Date and Time

When working with date and time, we need to consider if the timezone is
part of the information we want to store. We always store data in UTC-0.

`Settings.defaultZoneName = 'UTC';` will force node.js to use UTC locally.

For example, if we get a timestamp from a client that we expect to either
display as a local time for other users, we store it with a timezone.
JavaScript web clients will provide a timezone adjusted ISO date so
if the offset is important, we should use a separate field to store it.

The standard timestamp for API endpoints request and response is `ISO 8601`.

Example: `YYYY-MM-DDTHH:mm:ss.sssZ` "2021-03-12T14:46:56.421Z"

Use Luxon `DateTime.fromISO` and `Date.toISOString()`.

### Handling dates

Storing a date with a timezone will produce strange results while
grouping or displaying the date in a different timezone.

An example would be a birthday, this could be either an identifier when
trying to validate a drivers license but would be a date when trying to
add that date to a calendar notification. In the first case we would
display the date the same in all timezones, the second would warrant a
notification at midnight in the user's timezone regardless of the local
timezone.

### Time/Date ranges and periods

When displaying graphs that are averaged on a time period using two
timestamps will not be enough, the database needs to know when a day
starts or ends. For this, we use timezones.

A database like PostgreSQL can work with timezones.

```postgresql
SELECT *,
    to_char(
      to_timestamp(table_name.timestamp, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AT TIME ZONE $timeZone,
      '${TIME_GROUP}'
    ) as interval_alias
FROM table_name WHERE table_name.timestamp between '2021-03-12T14:46:56.421Z' and '2021-07-12T14:46:56.421Z'
GROUP BY interval_alias
```
