import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';
import { ENUM_ORDER_DIRECTION } from './types';

export async function select<T>(
  tableName: string,
  selectFields?: string[],
  whereConditions?: { [key: string]: string },
  orderBy?: { field: string; direction: ENUM_ORDER_DIRECTION },
  limit?: number,
): Promise<T[]> {
  let sqlQuery = Prisma.sql`SELECT `;

  if (selectFields && selectFields.length > 0) {
    const fields = selectFields.map((field) => `"${field}"`).join(', ');
    sqlQuery = Prisma.sql`${sqlQuery} ${Prisma.raw(fields)}`;
  } else {
    sqlQuery = Prisma.sql`${sqlQuery} *`;
  }

  sqlQuery = Prisma.sql`${sqlQuery} FROM "${Prisma.raw(tableName)}"`;

  if (whereConditions) {
    const whereClauses = Object.entries(whereConditions).map(([key, value]) => {
      return `"${key}" = ${Prisma.raw(value)}`;
    });
    sqlQuery = Prisma.sql`${sqlQuery} WHERE ${Prisma.join(whereClauses)}`;
  }

  if (orderBy) {
    sqlQuery = Prisma.sql`${sqlQuery} ORDER BY "${Prisma.raw(orderBy.field)}" ${Prisma.raw(orderBy.direction)}`;
  }

  if (limit) {
    sqlQuery = Prisma.sql`${sqlQuery} LIMIT ${Prisma.raw(limit.toString())}`;
  }

  try {
    const result = await PrismaClient.$queryRaw<T[]>(sqlQuery);
    return result;
  } catch (error) {
    console.error('Error executing raw SQL select:', error);
    throw error;
  }
}
