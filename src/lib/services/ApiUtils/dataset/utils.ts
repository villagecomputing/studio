import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/[datasetId]/utils/commonUtils';
import { exhaustiveCheck, guardStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { Column } from '@prisma/client';
import { compact } from 'lodash';
import { ColumnDefinition, ColumnType } from '../../DatabaseUtils/types';
import PrismaClient from '../../prisma';

type DatasetField = Pick<Column, 'name' | 'field' | 'index' | 'type'>;
export async function isDatasetNameAvailable(name: string): Promise<boolean> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return false;
  }

  const totalDatasetsWithSameName = await PrismaClient.dataset_list.count({
    where: {
      name: {
        equals: trimmedName,
      },
    },
  });

  return !totalDatasetsWithSameName;
}

export const getDatasetNameAndGTColumnField = async (
  datasetId: number,
): Promise<{ datasetName: string; groundTruthColumnField: string }> => {
  const dataset = await PrismaClient.dataset_list.findUniqueOrThrow({
    where: { id: datasetId },
    select: { name: true },
  });

  const groundTruthColumn = await PrismaClient.column.findFirstOrThrow({
    where: { dataset_id: datasetId, type: ENUM_Column_type.GROUND_TRUTH },
    select: { field: true },
  });
  return {
    datasetName: dataset.name,
    groundTruthColumnField: groundTruthColumn.field,
  };
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
    const name = columnName ? columnName : `Column_${index}`;
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
            isNullable: false,
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
        case ENUM_Column_type.PREDICTIVE_LABEL:
          throw new Error(`Unupported field type: ${field.type}`);
        default:
          exhaustiveCheck(type);
      }
    }),
  );
}
