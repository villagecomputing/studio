import { arrayContainsArray } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';
import { WhereConditions } from './types';

const buildSQLiteTableExistsSqlQuery = (tableName: string): Prisma.Sql => {
  return Prisma.sql`SELECT * FROM sqlite_master WHERE type='table' AND tbl_name = ${tableName}`;
};

const buildPostgresTableExistsSqlQuery = (tableName: string): Prisma.Sql => {
  return Prisma.sql`SELECT * FROM pg_tables WHERE schemaname = 'public' AND tablename = ${tableName}`;
};

const buildTableExistsQueryString = (tableName: string): Prisma.Sql => {
  if (process.env.NEXT_PUBLIC_APP_DATABASE_PROVIDER === 'sqlite') {
    return buildSQLiteTableExistsSqlQuery(tableName);
  } else {
    return buildPostgresTableExistsSqlQuery(tableName);
  }
};

export async function assertTableExists(tableName: string) {
  const checkTableExistsQuery = buildTableExistsQueryString(tableName);
  const result = await PrismaClient.$queryRaw<unknown[]>(checkTableExistsQuery);
  if (result.length !== 1) {
    throw new Error(`Table ${tableName} does not exist`);
  }
}

export async function getExperimentOrThrow(experimentId: string) {
  await assertTableExists(experimentId);
  return await PrismaClient.experiment.findUniqueOrThrow({
    where: {
      uuid: experimentId,
    },
  });
}

export async function getDatasetOrThrow(datasetId: string) {
  await assertTableExists(datasetId);
  return await PrismaClient.dataset.findUniqueOrThrow({
    where: {
      uuid: datasetId,
    },
  });
}

export async function getLogsEntryOrThrow(logsEntryId: string) {
  await assertTableExists(logsEntryId);
  return await PrismaClient.logs.findUniqueOrThrow({
    where: {
      uuid: logsEntryId,
    },
  });
}

export async function assertExperimentExists(experimentId: string) {
  await assertTableExists(experimentId);
  await PrismaClient.experiment.findUniqueOrThrow({
    where: {
      uuid: experimentId,
    },
  });
}

// ATM Experiment_column table is considered source of truth for the existance of the actual dynamic table
export async function isExperimentTableCreated(
  experimentId: string,
  fieldsToCheck: string[],
): Promise<boolean> {
  const existingFields = (
    await PrismaClient.experiment_column.findMany({
      select: {
        field: true,
      },
      where: {
        experiment_uuid: experimentId,
      },
    })
  ).map((column) => column.field);

  if (existingFields.length === 0) {
    return false;
  }

  // A table is already created but with different fields.
  if (!arrayContainsArray(existingFields, fieldsToCheck)) {
    throw new Error('Cannot insert due to invalid fields');
  }

  return true;
}

export async function assertApiKeyExists(key: string) {
  await PrismaClient.aPI_key.findUniqueOrThrow({
    where: {
      key,
      revoked_at: null,
    },
  });
}

export function buildPrismaWhereClause(
  whereConditions: WhereConditions,
  operator: ' AND ' | ' OR ' = ' AND ',
) {
  const whereClauses = Object.entries(whereConditions).map(([key, value]) => {
    if (value === null) {
      return Prisma.sql`${Prisma.raw(`"${key}" IS NULL`)}`;
    } else if (Array.isArray(value)) {
      const sanitizedValues = value
        .map((val) => `'${val.replaceAll("'", "''")}'`)
        .join(', ');
      return Prisma.sql`${Prisma.raw(`"${key}" IN (${sanitizedValues})`)}`;
    } else if (typeof value === 'object' && value.isNotNull) {
      return Prisma.sql`${Prisma.raw(`"${key}" IS NOT NULL`)}`;
    } else {
      return typeof value === 'number'
        ? Prisma.sql`${Prisma.raw(`"${key}" = ${value}`)}`
        : Prisma.sql`${Prisma.raw(`"${key}" = '${value.toString().replaceAll("'", "''")}'`)}`;
    }
  });
  return Prisma.join(whereClauses, operator);
}
