import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';
import { assertTableExists } from './common';

export async function create(
  tableName: string,
  columns: string[],
): Promise<number> {
  await assertTableExists(tableName);

  const idColumnDefinition = Prisma.sql`"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT`;
  const columnDefinitionStringArray = columns.map(
    (column) => Prisma.sql`"${column}" TEXT`,
  );

  const sqlQuery = Prisma.sql`CREATE TABLE "${Prisma.raw(tableName)}"
  (${Prisma.raw([idColumnDefinition, ...columnDefinitionStringArray].join(', '))})`;

  try {
    const result = await PrismaClient.$executeRaw(sqlQuery);
    return result;
  } catch (error) {
    console.error('Error executing raw SQL create:', error);
    throw error;
  }
}
