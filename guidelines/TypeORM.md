
## Database

### Configuration

Use `.env.local` or `.env` to edit the database configuration locally.

Production configuration should use environment variables.

### Custom Configuration

The configuration is taken first from the environment. If TYPEORM_CONNECTION
is set, typeorm expects all the other configuration as well.

Check `src/modules/app/typeorm.helper.ts`

Read more [here](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md#which-configuration-file-is-used-by-typeorm).

### Migrations

Make a new migration:
```
yarn run typeorm:cli migration:generate -n flowers
```

Run migrations:
```
yarn run typeorm:cli migration:run
```

Read more [here](https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md).


### Tips

- [Using decorators to control the transaction (@Transaction() and @TransactionManager()) is not recommended.](https://docs.nestjs.com/techniques/database#separating-entity-definition)

- [Example transactions](../modules/express-examples/src/modules/flower/flower.service.ts) are in the express-example module.

-
