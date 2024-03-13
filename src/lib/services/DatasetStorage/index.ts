import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/[datasetId]/utils/commonUtils';
import { uploadDatasetRowPayloadSchema } from '@/app/api/dataset/upload-as-table/schema';
import PrismaClient, { Prisma } from '@/lib/services/prisma';
import { ENUM_Ground_truth_status } from '@/lib/types';
import { arraysEqual } from '@/lib/utils';
import { z } from 'zod';

enum ColumnType {
  TEXT = 'TEXT',
  INTEGER = 'INTEGER',
}

type ColumnDefinition = {
  name: string;
  type: ColumnType;
  isNullale?: boolean;
  isPrimaryKey?: boolean;
  isAutoincrement?: boolean;
  typeCheckValues?: string[];
  defaultValue?: string;
};

export type DatasetData = {
  columns: string[];
  rows: Record<string, string>[];
};

type ColumnWithIndex = {
  name: string;
  index: number;
};

const extractDatasetColumns = (
  datasetRows: z.infer<typeof uploadDatasetRowPayloadSchema>[],
): ColumnWithIndex[] => {
  if (datasetRows.length === 0) {
    return [];
  }

  const firstRowColumns = Object.keys(datasetRows[0]);
  const columnsWithIndex = firstRowColumns.map((name, index) => ({
    index,
    name,
  }));

  datasetRows.forEach((row, rowIndex) => {
    if (rowIndex > 0) {
      const rowColumns = Object.keys(row);
      if (!arraysEqual(firstRowColumns, rowColumns)) {
        throw new Error(
          'Invalid dataset schema: all rows must have the same columns',
        );
      }
    }
  });

  return columnsWithIndex;
};

const commonColumnDefinitions: ColumnDefinition[] = [
  {
    name: 'id',
    type: ColumnType.INTEGER,
    isPrimaryKey: true,
    isAutoincrement: true,
    isNullale: false,
  },
  {
    name: 'ground_truth_status',
    type: ColumnType.TEXT,
    isNullale: false,
    typeCheckValues: Object.values(ENUM_Ground_truth_status).map(
      (value) => `'${value}'`,
    ),
    defaultValue: ENUM_Ground_truth_status.PENDING,
  },
];

export const buildColumnDefinitions = (
  datasetRows: z.infer<typeof uploadDatasetRowPayloadSchema>[],
): ColumnDefinition[] => {
  const columnsAndIndex = extractDatasetColumns(datasetRows);
  const datasetSpecificDefinitions: ColumnDefinition[] = columnsAndIndex.map(
    (column) => ({
      name: getColumnFieldFromNameAndIndex(column.name, column.index),
      type: ColumnType.TEXT,
    }),
  );
  return [...commonColumnDefinitions, ...datasetSpecificDefinitions];
};

const buildDefinitionString = (columnDefinition: ColumnDefinition): string => {
  let columnString = `${columnDefinition.name} ${columnDefinition.type}`;
  if (columnDefinition.isPrimaryKey) {
    columnString += ' PRIMARY KEY';
  }
  if (columnDefinition.isAutoincrement) {
    columnString += ' AUTOINCREMENT';
  }
  if (!columnDefinition.isNullale) {
    columnString += ' NOT NULL';
  }
  if (
    columnDefinition.typeCheckValues &&
    columnDefinition.typeCheckValues.length > 0
  ) {
    columnString += ` CHECK ( "type" IN (${columnDefinition.typeCheckValues.map((value) => `'${value}'`).join(', ')}) )`;
  }
  return columnString;
};

export const ensureDataset = async (
  datasetName: string,
  columnDefinitions: ColumnDefinition[],
) => {
  const columnDefinitionStringArray = columnDefinitions.map((definition) =>
    buildDefinitionString(definition),
  );
  const createTableQuery = Prisma.sql`CREATE TABLE IF NOT EXISTS ${Prisma.raw(datasetName)} (${Prisma.raw(columnDefinitionStringArray.join(', '))})`;
  await PrismaClient.$executeRaw(createTableQuery);

  //TODO: Check and sanitize Dataset_list and Columns table
};

export async function insertDatasetValues(
  datasetName: string,
  datasetData: DatasetData,
) {
  // Ensure that the values and columns are in order.
  const rowValuesArray: string[] = datasetData.rows.map((row) => {
    const rowValues: string[] = [];
    for (let i = 0; i < datasetData.columns.length; i++) {
      const columnToUpdate = datasetData.columns[i];
      const value = row[columnToUpdate];
      rowValues.push(value);
    }
    return `(${rowValues.map((value) => `${value}`).join(', ')})`;
  });

  const insertRowsQuery = Prisma.sql`INSERT INTO ${Prisma.raw(`"${datasetName}"`)} (${Prisma.raw(datasetData.columns.join(', '))}) VALUES ${Prisma.raw(rowValuesArray.join(',\n'))}`;
  await PrismaClient.$executeRaw(insertRowsQuery);
}
