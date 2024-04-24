import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';
import { buildPrismaWhereClause } from './common';
import { WhereConditions } from './types';

export async function selectAggregation(
  tableName: string,
  aggregation: {
    field?: string;
    func: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
  },
  whereConditions?: WhereConditions,
): Promise<string> {
  const aggField = aggregation.field
    ? Prisma.raw(`"${aggregation.field}"`)
    : '*';
  let sqlQuery = Prisma.sql`SELECT ${Prisma.raw(aggregation.func)}(${aggField}) AS result FROM "${Prisma.raw(tableName)}"`;

  if (whereConditions && Object.keys(whereConditions).length > 0) {
    const whereClause = buildPrismaWhereClause(whereConditions);
    sqlQuery = Prisma.sql`${sqlQuery} WHERE ${whereClause}`;
  }
  // Execute the aggregation query
  try {
    const result = await PrismaClient.$queryRaw<{ result: bigint }[]>(sqlQuery);
    // Convert BigInt to string
    return result[0]?.result.toString() ?? '0';
  } catch (error) {
    console.error('Error executing raw SQL aggregation:', error);
    throw error;
  }
}
