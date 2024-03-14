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

  try {
    // Use raw insert function to insert multiple rows in a single request
    const datasetFieldRows = datasetFields.map((field) => ({
      dataset_id: dataset.id.toString(),
      name: field.name,
      field: field.field,
      index: field.index.toString(),
      type: field.type,
    }));
    await DatabaseUtils.insert('Column', datasetFieldRows);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to insert into columns table');
  }

  return dataset.id;
}
