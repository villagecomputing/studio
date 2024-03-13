import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/[datasetId]/utils/commonUtils';
import { newDatasetPayloadSchema } from '@/app/api/dataset/new/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Column_type } from '@/lib/types';
import { PrismaClient } from '@prisma/client';
import DatabaseUtils from '../../DatabaseUtils';

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

  for (let i = 0; i < groundTruths.length; i++) {
    datasetFields.push({
      displayName: groundTruths[i],
      sanitizedName: getColumnFieldFromNameAndIndex(groundTruths[i], i),
      index: i + columns.length,
      type: ENUM_Column_type.GROUND_TRUTH,
    });
  }

  for (let i = 0; i < groundTruths.length; i++) {
    datasetFields.push({
      displayName: `${groundTruths[i]}_STATUS`,
      sanitizedName: `${groundTruths[i]}_STATUS`,
      index: -1,
      type: ENUM_Column_type.GROUND_TRUTH_STATUS,
    });
  }

  return datasetFields;
}

export async function newDataset(
  payload: PayloadSchemaType[ApiEndpoints.datasetNew],
) {
  const params = newDatasetPayloadSchema.parse(payload);
  const { datasetName, columns, groundTruths } = params;

  const datasetFields: DatasetField[] = buildDatasetFields(
    columns,
    groundTruths,
  );

  const result = await DatabaseUtils.create(
    datasetName,
    datasetFields.map((column) => column.sanitizedName),
  );

  if (!result) {
    throw new Error('Failed to create new dataset table');
  }

  const dataset = await PrismaClient.dataset_list.create({
    data: {
      name: datasetName,
    },
  });

  if (dataset?.id) {
    throw new Error('Failed to insert into dataset table');
  }

  // TODO: update logic to use future executeRaw for bulk insert
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
