import { newDatasetPayloadSchema } from '@/app/api/dataset/new/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';

import DatabaseUtils from '../../DatabaseUtils';
import { PrismaClient } from '../../prisma';
import { buildDatasetColumnDefinition, buildDatasetFields } from './utils';

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
  await Promise.all(
    datasetFields.map(
      async (field) =>
        await PrismaClient.column.create({
          data: {
            dataset_id: dataset.id,
            name: field.name,
            field: field.field,
            index: field.index,
            type: field.type,
          },
        }),
    ),
  );
  return dataset.id;
}
