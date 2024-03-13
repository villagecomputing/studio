import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/[datasetId]/utils/commonUtils';
import { uploadDatasetRowPayloadSchema } from '@/app/api/dataset/upload-as-table/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import PrismaClient, { Prisma } from '@/lib/services/prisma';
import { ENUM_Ground_truth_status } from '@/lib/types';
import { arraysEqual } from '@/lib/utils';
import { z } from 'zod';

enum ColumnType {
  TEXT = 'TEXT',
  INTEGER = 'INTEGER',
}

type ColumnDefinition = {
  sanitizedName: string;
  type: ColumnType;
  isNullale?: boolean;
  isPrimaryKey?: boolean;
  isAutoincrement?: boolean;
  typeCheckValues?: string[];
  defaultValue?: string;
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

const commonColumnDefinitions: Record<string, ColumnDefinition> = {
  id: {
    sanitizedName: 'id',
    type: ColumnType.INTEGER,
    isPrimaryKey: true,
    isAutoincrement: true,
    isNullale: false,
  },
  ground_truth_status: {
    sanitizedName: 'ground_truth_status',
    type: ColumnType.TEXT,
    isNullale: false,
    typeCheckValues: Object.values(ENUM_Ground_truth_status).map(
      (value) => `'${value}'`,
    ),
    defaultValue: ENUM_Ground_truth_status.PENDING,
  },
};
const buildColumnDefinitions = (
  datasetRows: z.infer<typeof uploadDatasetRowPayloadSchema>[],
) => {
  const columnsAndIndex = extractDatasetColumns(datasetRows);
  const columnDefinitions: Record<string, ColumnDefinition> =
    commonColumnDefinitions;
  columnsAndIndex.forEach(
    (column) =>
      (columnDefinitions[column.name] = {
        sanitizedName: getColumnFieldFromNameAndIndex(
          column.name,
          column.index,
        ),
        type: ColumnType.TEXT,
      }),
  );

  return columnDefinitions;
};

const buildDefinitionString = (columnDefinition: ColumnDefinition): string => {
  let columnString = `${columnDefinition.sanitizedName} ${columnDefinition.type}`;
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

const ensureDataset = async (
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

const insertDatasetValues = async (
  datasetName: string,
  valuesByColumnRows: Record<string, string>[],
) => {
  if (valuesByColumnRows.length === 0) {
    return;
  }

  const firstRowColumns: string[] = Object.keys(valuesByColumnRows[0]);
  const rowValuesArray: string[] = [];

  for (let i = 0; i <= valuesByColumnRows.length; i++) {
    const columns = Object.keys(valuesByColumnRows[i]);
    if (!arraysEqual(firstRowColumns, columns)) {
      throw new Error(
        'Invalid dataset schema: all rows must have the same columns',
      );
    }

    rowValuesArray.push(
      `(${Object.values(valuesByColumnRows[i])
        .map((value) => `${value}`)
        .join(', ')})`,
    );
  }

  const insertRowsQuery = Prisma.sql`INSERT INTO ${Prisma.raw(`"${datasetName}"`)} (${Prisma.raw(firstRowColumns.join(', '))}) VALUES ${Prisma.raw(rowValuesArray.join(',\n'))}`;
  await PrismaClient.$executeRaw(insertRowsQuery);
};

export async function saveDatasetDetailsAsTable(
  dataset: PayloadSchemaType[ApiEndpoints.datasetUploadAsTable],
) {
  const columnDefinitions = buildColumnDefinitions(dataset.datasetRows);
  await ensureDataset(dataset.datasetName, Object.values(columnDefinitions));

  const valuesByColumnRows: Record<string, string>[] = dataset.datasetRows.map(
    (row) => {
      const rowRecord: Record<string, string> = {};

      // Add values from the dataset row
      row.forEach((cell) => {
        rowRecord[columnDefinitions[cell.columnName].sanitizedName] =
          cell.columnValue;
      });

      // Add non-autoincrementable common columns with default values
      Object.values(commonColumnDefinitions).forEach((columnDef) => {
        if (!columnDef.isAutoincrement) {
          rowRecord[columnDef.sanitizedName] = columnDef.defaultValue ?? '';
        }
      });

      return rowRecord;
    },
  );

  await insertDatasetValues(dataset.datasetName, valuesByColumnRows);
}
