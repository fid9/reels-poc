import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

/**
 * TypeORM makes random names for constraints, use this
 *  strategy to make them based on column names
 */
export class SnakeCaseNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName: string): string {
    return customName
      ? customName
      : snakeCase(className).replace(/_entity$/, '');
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.concat('').join('_')) +
      (customName ? customName : snakeCase(propertyName))
    );
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnInverseSideName(
    joinColumnName: string,
    propertyName: string,
  ): string {
    if (joinColumnName) return joinColumnName;

    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    // secondPropertyName: string,
  ): string {
    return snakeCase(
      firstTableName +
        '_' +
        firstPropertyName.replace(/\./gi, '_') +
        '_' +
        secondTableName,
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(
      tableName + '_' + (columnName ? columnName : propertyName),
    );
  }

  classTableInheritanceParentColumnName(
    parentTableName: string,
    parentTableIdPropertyName: string,
  ): string {
    return snakeCase(parentTableName + '_' + parentTableIdPropertyName);
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    return alias + '__' + propertyPath.replace('.', '_');
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const tableName = extractTableName(tableOrName);
    return snakeCase(`pk_${tableName}_${columnNames.join('_')}`);
  }

  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    const tableName = extractTableName(tableOrName);
    return snakeCase(`uq_${tableName}_${columnNames.join('_')}`);
  }

  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    _referencedTablePath?: string,
    _referencedColumnNames?: string[],
  ): string {
    const tableName = extractTableName(tableOrName);
    if (
      !_referencedTablePath ||
      !_referencedColumnNames ||
      _referencedColumnNames.length === 0
    ) {
      // eslint-disable-next-line prefer-rest-params
      throw new Error(`Invalid table reference, arguments: ${arguments}`);
    }
    return snakeCase(
      `fk_${tableName}_${columnNames.join(
        '_',
      )}_${_referencedTablePath}_${_referencedColumnNames.join('_')}`,
    );
  }

  indexName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string,
  ): string {
    const tableName = extractTableName(tableOrName);
    const whereSuffix = where ? `_where_${where}` : '';
    return snakeCase(`idx_${tableName}_${columnNames.join('_')}${whereSuffix}`);
  }

  checkConstraintName(tableOrName: Table | string, expression: string): string {
    const tableName = extractTableName(tableOrName);
    return snakeCase(`chk_${tableName}_${expression}`);
  }

  relationConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string,
  ): string {
    const tableName = extractTableName(tableOrName);
    const whereSuffix = where ? `_where_${where}` : '';
    return snakeCase(`rel_${tableName}_${columnNames.join('_')}${whereSuffix}`);
  }

  joinTableInverseColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    // Trying to figure out when this function is called
    // eslint-disable-next-line prefer-rest-params,no-console
    console.log(`joinTableInverseColumnName: ${arguments}`);
    return super.joinTableInverseColumnName(
      tableName,
      propertyName,
      columnName,
    );
  }

  // closureJunctionTableName(originalClosureTableName: string): string;
  // defaultConstraintName(tableOrName: Table | string, columnName: string, : string;
  // exclusionConstraintName(tableOrName: Table | string, expression: string,): string;
  // joinTableColumnDuplicationPrefix(columnName: string, index: number): string;
  // prefixTableName(prefix: string, tableName: string): string;
}

function extractTableName(tableOrName: Table | string) {
  if (tableOrName instanceof Table) {
    return tableOrName.name;
  } else if (typeof tableOrName === 'string') {
    return tableOrName;
  } else {
    throw new Error(
      `Parameter is not a Table instance or string: ${tableOrName}`,
    );
  }
}
