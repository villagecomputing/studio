import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';

export async function selectAggregation(
  tableName: string,
  aggregation: {
    field?: string;
    func: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
  },
  whereConditions?: { [key: string]: string },
): Promise<string> {
  const aggField = aggregation.field
    ? `"${Prisma.raw(aggregation.field)}"`
    : '*';
  let sqlQuery = Prisma.sql`SELECT ${Prisma.raw(aggregation.func)}(${aggField}) AS result FROM "${Prisma.raw(tableName)}"`;

  if (whereConditions) {
    const whereClauses = Object.entries(whereConditions).map(([key, value]) => {
      return `"${key}" = ${Prisma.raw(value)}`;
    });
    sqlQuery = Prisma.sql`${sqlQuery} WHERE ${Prisma.join(whereClauses)}`;
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
