import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';
import { buildPrismaWhereClause } from './common';
import { ENUM_ORDER_DIRECTION, WhereConditions } from './types';

export async function select<T>({
  tableName,
  selectFields,
  whereConditions,
  orderBy,
  limit,
}: {
  tableName: string;
  selectFields?: string[];
  whereConditions?: WhereConditions;
  orderBy?: { field: string; direction: ENUM_ORDER_DIRECTION };
  limit?: number;
}): Promise<T[]> {
  let sqlQuery = Prisma.sql`SELECT `;

  if (selectFields && selectFields.length > 0) {
    const fields = selectFields.map((field) => `"${field}"`).join(', ');
    sqlQuery = Prisma.sql`${sqlQuery} ${Prisma.raw(fields)}`;
  } else {
    sqlQuery = Prisma.sql`${sqlQuery} *`;
  }

  sqlQuery = Prisma.sql`${sqlQuery} FROM "${Prisma.raw(tableName)}"`;

  if (whereConditions && Object.keys(whereConditions).length > 0) {
    const whereClause = buildPrismaWhereClause(whereConditions);
    sqlQuery = Prisma.sql`${sqlQuery} WHERE ${whereClause}`;
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
    console.error('Error executing raw SQL select:', error, { sqlQuery });
    throw error;
  }
}
