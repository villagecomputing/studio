import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/[datasetId]/utils/commonUtils';
import { exhaustiveCheck, guardStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { Column } from '@prisma/client';
import _ from 'lodash';
import { ColumnDefinition, ColumnType } from '../../DatabaseUtils/types';
import PrismaClient from '../../prisma';

type DatasetField = Pick<Column, 'name' | 'field' | 'index' | 'type'>;

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
  columns.map((value, index) =>
    datasetFields.push({
      name: value,
      field: getColumnFieldFromNameAndIndex(value, index),
      index: index,
      type: ENUM_Column_type.INPUT,
    }),
  );

  const groundTruthSanitizedsNames: string[] = [];
  groundTruths.map((value, index) => {
    const newIndex = index + columns.length;
    const sanitizedName = getColumnFieldFromNameAndIndex(
      groundTruths[newIndex],
      index,
    );
    groundTruthSanitizedsNames.push(sanitizedName);
    datasetFields.push({
      name: value,
      field: sanitizedName,
      index: newIndex,
      type: ENUM_Column_type.GROUND_TRUTH,
    });
  });

  groundTruths.map((value, index) =>
    datasetFields.push({
      name: `${value} status`,
      field: getGroundTruthStatusColumnName(groundTruthSanitizedsNames[index]),
      index: -1,
      type: ENUM_Column_type.GROUND_TRUTH_STATUS,
    }),
  );

  return datasetFields;
}

export function buildDatasetColumnDefinition(
  datasetFields: DatasetField[],
): ColumnDefinition[] {
  return _(
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
  )
    .compact()
    .value();
}
