import { newDatasetPayloadSchema } from '@/app/api/dataset/new/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';

import DatabaseUtils from '../../DatabaseUtils';
import PrismaClient from '../../prisma';
import { buildDatasetColumnDefinition, buildDatasetFields } from './utils';

export async function newDataset(
  payload: PayloadSchemaType[ApiEndpoints.datasetNew],
) {
  const params = newDatasetPayloadSchema.parse(payload);
  const { datasetName, columns, groundTruths } = params;

  // Build the dataset fields based on columns and groundTruths
  const datasetFields = buildDatasetFields(columns, groundTruths);
  // Generate the column definitions for the new dataset
  const columnDefinitions = buildDatasetColumnDefinition(datasetFields);

  // Create a new dynamic dataset table with the given name and column definitions
  await DatabaseUtils.create(datasetName, columnDefinitions);

  // Add a new entry to the dataset_list table with the dataset details
  const dataset = await PrismaClient.dataset_list.create({
    data: {
      name: datasetName,
    },
  });

  await Promise.all(
    datasetFields.map(
      async (field) =>
        await PrismaClient.dataset_column.create({
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
