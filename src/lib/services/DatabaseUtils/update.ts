import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';
import { assertTableExists } from './common';

export async function update<T>(
  tableName: string,
  setValues: { [key: string]: string },
  whereConditions?: { [key: string]: string },
): Promise<number> {
  await assertTableExists(tableName);

  let sqlQuery = Prisma.sql`UPDATE "${Prisma.raw(tableName)}" SET `;
  const setClauses = Object.entries(setValues).map(([key, value]) => {
    return Prisma.raw(`"${key}" = "${value}"`);
  });
  sqlQuery = Prisma.sql`${sqlQuery} ${Prisma.join(setClauses)}`;

  if (whereConditions) {
    const whereClauses = Object.entries(whereConditions).map(([key, value]) => {
      return Prisma.raw(`"${key}" = "${value}"`);
    });
    sqlQuery = Prisma.sql`${sqlQuery} WHERE ${Prisma.join(whereClauses)}`;
  }

  try {
    const result = await PrismaClient.$executeRaw<T>(sqlQuery);
    return result;
  } catch (error) {
    console.error('Error executing raw SQL update:', error);
    throw error;
  }
}
