import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/[datasetId]/utils/commonUtils';
import { newDatasetPayloadSchema } from '@/app/api/dataset/new/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Column_type } from '@/lib/types';
import { PrismaClient } from '@prisma/client';
import DatabaseUtils from '../../DatabaseUtils';
import { ColumnDefinition, ColumnType } from '../../DatabaseUtils/types';
import { getGroundTruthStatusColumnName } from './utils';

type DatasetField = {
  displayName: string;
  sanitizedName: string;
  index: number;
  type: ENUM_Column_type;
};

function buildDatasetFields(
  columns: string[],
  groundTruths: string[],
): DatasetField[] {
  const datasetFields: DatasetField[] = [
    {
      displayName: 'id',
      sanitizedName: 'id',
      index: -1,
      type: ENUM_Column_type.IDENTIFIER,
    },
  ];

  for (let i = 0; i < columns.length; i++) {
    datasetFields.push({
      displayName: columns[i],
      sanitizedName: getColumnFieldFromNameAndIndex(columns[i], i),
      index: i,
      type: ENUM_Column_type.INPUT,
    });
  }

  const groundTruthSanitizedsNames: string[] = [];
  for (let i = 0; i < groundTruths.length; i++) {
    const index = i + columns.length;
    const sanitizedName = getColumnFieldFromNameAndIndex(
      groundTruths[index],
      index,
    );
    groundTruthSanitizedsNames.push(sanitizedName);
    datasetFields.push({
      displayName: groundTruths[i],
      sanitizedName: sanitizedName,
      index: index + columns.length,
      type: ENUM_Column_type.GROUND_TRUTH,
    });
  }

  for (let i = 0; i < groundTruths.length; i++) {
    datasetFields.push({
      displayName: `${groundTruths[i]} status`,
      sanitizedName: getGroundTruthStatusColumnName(
        groundTruthSanitizedsNames[i],
      ),
      index: -1,
      type: ENUM_Column_type.GROUND_TRUTH_STATUS,
    });
  }

  return datasetFields;
}

function buildDatasetColumnDefinition(
  datasetFields: DatasetField[],
): ColumnDefinition[] {
  return datasetFields.map((field) => {
    switch (field.type) {
      case ENUM_Column_type.IDENTIFIER:
        return {
          isAutoincrement: true,
          type: ColumnType.INTEGER,
          isNullable: false,
          name: field.sanitizedName,
          isPrimaryKey: true,
        };
      case ENUM_Column_type.GROUND_TRUTH:
      case ENUM_Column_type.GROUND_TRUTH_STATUS:
      case ENUM_Column_type.INPUT:
        return {
          type: ColumnType.TEXT,
          name: field.sanitizedName,
        };
      default:
        throw new Error(`Unupported field type: ${field.type}`);
    }
  });
}

export async function newDataset(
  payload: PayloadSchemaType[ApiEndpoints.datasetNew],
) {
  const params = newDatasetPayloadSchema.parse(payload);
  const { datasetName, columns, groundTruths } = params;

  const datasetFields = buildDatasetFields(columns, groundTruths);
  const columnDefinitions = buildDatasetColumnDefinition(datasetFields);
  // Create dynamic dataset table
  const result = await DatabaseUtils.create(datasetName, columnDefinitions);

  if (!result) {
    throw new Error('Failed to create new dataset table');
  }

  // TODO: handle existing entries to the dataset_list table

  // Update dataset_list table
  const dataset = await PrismaClient.dataset_list.create({
    data: {
      name: datasetName,
    },
  });

  if (dataset?.id) {
    throw new Error('Failed to insert into dataset table');
  }

  // TODO: update logic to use future executeRaw for bulk insert
  // Update columns table
  for (const field of datasetFields) {
    await PrismaClient.column.create({
      data: {
        dataset_id: dataset.id,
        name: field.displayName,
        field: field.sanitizedName,
        index: field.index,
        type: field.type,
      },
    });
  }

  return dataset.id;
}
