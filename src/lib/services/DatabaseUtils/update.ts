import { Prisma } from '@prisma/client';
import loggerFactory, { LOGGER_TYPE } from '../Logger';
import PrismaClient from '../prisma';
import { buildPrismaWhereClause } from './common';
import { WhereConditions } from './types';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'update',
});

export async function update<T>({
  tableName,
  setValues,
  whereConditions,
}: {
  tableName: string;
  setValues: Record<string, string>;
  whereConditions?: WhereConditions;
}): Promise<number> {
  const setParams = Prisma.join(
    Object.entries(setValues).map(([key, value]) => {
      // Prisma.raw will not escape the value.
      // Because we are putting the values between single quotes we need to escape any single quotes inside it
      return Prisma.sql`${Prisma.raw(`"${key}" = '${value.toString().replaceAll("'", "''")}'`)}`;
    }),
  );

  let sqlQuery = Prisma.sql`UPDATE "${Prisma.raw(tableName)}" SET ${setParams}`;

  if (whereConditions && Object.keys(whereConditions).length > 0) {
    const whereClause = buildPrismaWhereClause(whereConditions);
    sqlQuery = Prisma.sql`${sqlQuery} WHERE ${whereClause}`;
  }

  try {
    const result = await PrismaClient.$executeRaw<T>(sqlQuery);
    return result;
  } catch (error) {
    logger.error('Error executing raw SQL update:', error, { sqlQuery });
    throw error;
  }
}
