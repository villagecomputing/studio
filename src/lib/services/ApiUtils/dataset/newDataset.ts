import { newDatasetPayloadSchema } from '@/app/api/dataset/new/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';

import { UUIDPrefixEnum, generateUUID } from '@/lib/utils';
import DatabaseUtils from '../../DatabaseUtils';
import PrismaClient from '../../prisma';
import { buildDatasetColumnDefinition, buildDatasetFields } from './utils';

export async function newDataset(
  payload: PayloadSchemaType[ApiEndpoints.datasetNew],
  userId: string | null,
) {
  const params = newDatasetPayloadSchema.parse(payload);
  const { datasetName, columns, groundTruths, logsUuid } = params;
  const datasetId = generateUUID(UUIDPrefixEnum.DATASET);

  // Build the dataset fields based on columns and groundTruths
  const datasetFields = buildDatasetFields(columns, groundTruths);
  // Generate the column definitions for the new dataset
  const columnDefinitions = buildDatasetColumnDefinition(datasetFields);
  // Create a new dynamic dataset table with the generated uuid as name and column definitions
  await DatabaseUtils.create(datasetId, columnDefinitions);

  // Add a new entry to the dataset table with the dataset details
  const dataset = await PrismaClient.dataset.create({
    data: {
      uuid: datasetId,
      name: datasetName,
      created_by: userId,
      Logs: logsUuid
        ? {
            connect: {
              uuid: logsUuid,
            },
          }
        : {},
    },
  });

  await Promise.all(
    datasetFields.map(
      async (field) =>
        await PrismaClient.dataset_column.create({
          data: {
            dataset_uuid: dataset.uuid,
            name: field.name,
            field: field.field,
            index: field.index,
            type: field.type,
          },
        }),
    ),
  );

  return dataset.uuid;
}
