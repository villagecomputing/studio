import { Prisma } from '@prisma/client';

export type SelectParams = {
  tableName: string;
  selectFields?: string[];
  whereConditions?: Prisma.Sql;
  orderBy?: Prisma.Sql;
  limit?: number;
};

export enum ColumnType {
  TEXT = 'TEXT',
  INTEGER = 'INTEGER',
}

export type ColumnDefinition = {
  name: string;
  type: ColumnType;
  isNullable?: boolean;
  isPrimaryKey?: boolean;
  isAutoincrement?: boolean;
  typeCheckValues?: string[];
  defaultValue?: string;
};
