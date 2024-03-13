import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';
import { assertTableExists } from './common';
import { ColumnDefinition, ColumnType } from './types';

const buildDefinitionString = (columnDefinition: ColumnDefinition): string => {
  let columnString = `${columnDefinition.name} ${columnDefinition.type}`;
  if (columnDefinition.defaultValue) {
    columnString += ` DEFAULT ${
      columnDefinition.type === ColumnType.INTEGER
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
  if (!columnDefinition.isNullable) {
    columnString += ' NOT NULL';
  }
  if (
    columnDefinition.typeCheckValues &&
    columnDefinition.typeCheckValues.length > 0
  ) {
    columnString += ` CHECK ( "type" IN (${columnDefinition.typeCheckValues.map((value) => `'${value}'`).join(', ')}) )`;
  }

  return columnString;
};

export async function create(
  tableName: string,
  columnDefinitions: ColumnDefinition[],
): Promise<number> {
  await assertTableExists(tableName);

  const columnDefinitionStringArray = columnDefinitions.map((definition) =>
    buildDefinitionString(definition),
  );
  const sqlQuery = Prisma.sql`CREATE TABLE "${Prisma.raw(tableName)}"
  (${Prisma.raw(columnDefinitionStringArray.join(', '))})`;

  try {
    const result = await PrismaClient.$executeRaw(sqlQuery);
    return result;
  } catch (error) {
    console.error('Error executing raw SQL create:', error);
    throw error;
  }
}
