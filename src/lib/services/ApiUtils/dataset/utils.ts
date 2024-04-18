import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/utils/commonUtils';
import { exhaustiveCheck, guardStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { Dataset_column } from '@prisma/client';
import { compact } from 'lodash';
import { ColumnDefinition, ColumnType } from '../../DatabaseUtils/types';
import PrismaClient from '../../prisma';

type DatasetField = Pick<Dataset_column, 'name' | 'field' | 'index' | 'type'>;
export const DEFAULT_COLUMN_NAME_PREFIX = 'Column_';

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
          return {
            type: ColumnType.TEXT,
            name: field.field,
          };
        case ENUM_Column_type.GROUND_TRUTH_STATUS:
          return {
            type: ColumnType.TEXT,
            name: field.field,
            typeCheckValues: Object.values(ENUM_Ground_truth_status),
            defaultValue: ENUM_Ground_truth_status.PENDING,
          };
        default:
          exhaustiveCheck(type);
      }
    }),
  );
}
