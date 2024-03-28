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

export enum ENUM_ORDER_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

export type ColumnDefinition = {
  name: string;
  type: ColumnType;
  isNotNull?: boolean;
  isPrimaryKey?: boolean;
  isAutoincrement?: boolean;
  typeCheckValues?: string[];
  defaultValue?: string;
};
