import { Prisma } from '@prisma/client';

export type SelectParams = {
  tableName: string;
  selectFields?: string[];
  whereConditions?: Prisma.Sql;
  orderBy?: Prisma.Sql;
  limit?: number;
};
