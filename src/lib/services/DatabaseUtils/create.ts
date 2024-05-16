import { Prisma } from '@prisma/client';
import loggerFactory, { LOGGER_TYPE } from '../Logger';
import PrismaClient from '../prisma';
import { ColumnDefinition, ColumnType } from './types';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'create',
});

const buildSQLiteDefinitionString = (
  columnDefinition: ColumnDefinition,
): string => {
  let columnString = `${columnDefinition.name} ${columnDefinition.type}`;
  if (columnDefinition.defaultValue) {
    columnString += ` DEFAULT ${
      columnDefinition.type === ColumnType.INTEGER ||
      columnDefinition.type === ColumnType.DATETIME
        ? columnDefinition.defaultValue
        : `"${columnDefinition.defaultValue}"`
    } `;
  }
  if (columnDefinition.isPrimaryKey) {
    columnString += ' PRIMARY KEY';
  }
  if (columnDefinition.isAutoincrement) {
    columnString += ' AUTOINCREMENT';
  }
  if (columnDefinition.isNotNull) {
    columnString += ' NOT NULL';
  }
  if (columnDefinition.isUnique) {
    columnString += ' UNIQUE';
  }
  if (
    columnDefinition.typeCheckValues &&
    columnDefinition.typeCheckValues.length > 0
  ) {
    columnString += ` CHECK ( "${columnDefinition.name}" IN (${columnDefinition.typeCheckValues.map((value) => `'${value}'`).join(', ')}) )`;
  }

  return columnString;
};

const buildPostgresDefinitionString = (
  columnDefinition: ColumnDefinition,
): string => {
  let columnString = `"${columnDefinition.name}" ${columnDefinition.type === ColumnType.DATETIME ? 'TIMESTAMP WITH TIME ZONE' : columnDefinition.type}`;
  if (columnDefinition.defaultValue !== undefined) {
    columnString += ` DEFAULT ${
      columnDefinition.type === ColumnType.INTEGER ||
      columnDefinition.type === ColumnType.DATETIME
        ? columnDefinition.defaultValue
        : `'${columnDefinition.defaultValue}'`
    }`;
  }
  if (columnDefinition.isPrimaryKey) {
    columnString += ' PRIMARY KEY';
  }
  if (columnDefinition.isAutoincrement) {
    columnString += ' GENERATED ALWAYS AS IDENTITY';
  }
  if (columnDefinition.isNotNull) {
    columnString += ' NOT NULL';
  }
  if (columnDefinition.isUnique) {
    columnString += ' UNIQUE';
  }
  if (
    columnDefinition.typeCheckValues &&
    columnDefinition.typeCheckValues.length > 0
  ) {
    columnString += ` CHECK ("${columnDefinition.name}" IN (${columnDefinition.typeCheckValues.map((value) => `'${value}'`).join(', ')}))`;
  }

  return columnString;
};

const buildColumnDefinitionString = (columnDefinition: ColumnDefinition) => {
  if (process.env.NEXT_PUBLIC_APP_DATABASE_PROVIDER === 'sqlite') {
    return buildSQLiteDefinitionString(columnDefinition);
  } else {
    return buildPostgresDefinitionString(columnDefinition);
  }
};

export async function create(
  tableName: string,
  columnDefinitions: ColumnDefinition[],
): Promise<number> {
  const columnDefinitionStringArray = columnDefinitions.map((definition) =>
    buildColumnDefinitionString(definition),
  );

  const sqlQuery = Prisma.sql`CREATE TABLE "${Prisma.raw(tableName)}"
  (${Prisma.raw(columnDefinitionStringArray.join(', '))})`;

  try {
    const result = await PrismaClient.$executeRaw(sqlQuery);
    return result;
  } catch (error) {
    logger.error('Error executing raw SQL create:', error, { sqlQuery });
    throw error;
  }
}
