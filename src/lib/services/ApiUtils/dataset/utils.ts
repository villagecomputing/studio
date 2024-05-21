import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/utils/commonUtils';
import { exhaustiveCheck, guardStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { Dataset_column } from '@prisma/client';
import { compact } from 'lodash';
import { ColumnDefinition, ColumnType } from '../../DatabaseUtils/types';
import PrismaClient from '../../prisma';

type DatasetField = Pick<Dataset_column, 'name' | 'field' | 'index' | 'type'>;
export const DEFAULT_COLUMN_NAME_PREFIX = 'Column_';

export enum Enum_Dynamic_dataset_static_fields {
  LOGS_ROW_ID = 'logs_row_id',
  CREATED_AT = 'created_at',
  ROW_ID = 'row_id',
}

// Added for backwards compatibility for dynamic datasets that
// were already created before switching from fingerprint to row_id in the API
export const API_SCHEMA_PROP_TO_DB_STATIC_FIELD_MAPPING: Record<
  string,
  string
> = {
  [Enum_Dynamic_dataset_static_fields.ROW_ID]: 'fingerprint',
};

const UNIQUE_FIELDS: string[] = [Enum_Dynamic_dataset_static_fields.ROW_ID];

export const getGTColumnField = async (datasetId: string): Promise<string> => {
  const groundTruthColumn = await PrismaClient.dataset_column.findFirstOrThrow({
    where: { dataset_uuid: datasetId, type: ENUM_Column_type.GROUND_TRUTH },
    select: { field: true },
  });
  return groundTruthColumn.field;
};

export const getGroundTruthStatusColumnName = (
  groundTruthColumnName: string,
) => {
  return `${groundTruthColumnName}_STATUS`;
};

export function buildDatasetFields(
  columns: string[],
  groundTruths: string[],
): DatasetField[] {
  const datasetFields: DatasetField[] = [
    {
      name: 'id',
      field: 'id',
      index: -1,
      type: ENUM_Column_type.IDENTIFIER,
    },
    {
      name: Enum_Dynamic_dataset_static_fields.CREATED_AT,
      field: Enum_Dynamic_dataset_static_fields.CREATED_AT,
      index: -1,
      type: ENUM_Column_type.TIMESTAMP,
    },
  ];
  columns.map((columnName, index) => {
    const name = columnName
      ? columnName
      : `${DEFAULT_COLUMN_NAME_PREFIX}${index}`;
    datasetFields.push({
      name,
      field: getColumnFieldFromNameAndIndex(name, index),
      index,
      type: ENUM_Column_type.INPUT,
    });
  });

  groundTruths.map((name, index) => {
    const indexInDataset = index + columns.length;
    const field = getColumnFieldFromNameAndIndex(name, indexInDataset);
    datasetFields.push({
      name,
      field,
      index: indexInDataset,
      type: ENUM_Column_type.GROUND_TRUTH,
    });
    datasetFields.push({
      name: getGroundTruthStatusColumnName(field),
      field: getGroundTruthStatusColumnName(field),
      index: -1,
      type: ENUM_Column_type.GROUND_TRUTH_STATUS,
    });
  });

  datasetFields.push({
    name: Enum_Dynamic_dataset_static_fields.LOGS_ROW_ID,
    field: Enum_Dynamic_dataset_static_fields.LOGS_ROW_ID,
    type: ENUM_Column_type.METADATA,
    index: -1,
  });
  datasetFields.push({
    name: API_SCHEMA_PROP_TO_DB_STATIC_FIELD_MAPPING[
      Enum_Dynamic_dataset_static_fields.ROW_ID
    ],
    field:
      API_SCHEMA_PROP_TO_DB_STATIC_FIELD_MAPPING[
        Enum_Dynamic_dataset_static_fields.ROW_ID
      ],
    index: -1,
    type: ENUM_Column_type.METADATA,
  });

  return datasetFields;
}

export function buildDatasetColumnDefinition(
  datasetFields: DatasetField[],
): ColumnDefinition[] {
  return compact(
    datasetFields.map((field) => {
      const type = guardStringEnum(ENUM_Column_type, field.type);
      switch (type) {
        case ENUM_Column_type.IDENTIFIER:
          return {
            isAutoincrement: true,
            type: ColumnType.INTEGER,
            isNotNull: true,
            name: field.field,
            isPrimaryKey: true,
          };
        case ENUM_Column_type.GROUND_TRUTH:
        case ENUM_Column_type.INPUT:
        case ENUM_Column_type.METADATA:
          return {
            type: ColumnType.TEXT,
            name: field.field,
            isUnique: UNIQUE_FIELDS.includes(field.field),
          };
        case ENUM_Column_type.GROUND_TRUTH_STATUS:
          return {
            type: ColumnType.TEXT,
            name: field.field,
            typeCheckValues: Object.values(ENUM_Ground_truth_status),
            defaultValue: ENUM_Ground_truth_status.PENDING,
          };
        case ENUM_Column_type.TIMESTAMP:
          return {
            type: ColumnType.DATETIME,
            name: field.field,
            defaultValue: 'CURRENT_TIMESTAMP',
            isNotNull: true,
          };
        default:
          exhaustiveCheck(type);
      }
    }),
  );
}
