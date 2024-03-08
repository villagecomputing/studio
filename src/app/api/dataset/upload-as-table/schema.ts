import { z } from 'zod';

export const uploadDatasetRowPayloadSchema = z.array(
  z.object({
    columnName: z.string(),
    columnValue: z.string(),
    columnType: z.optional(z.string()),
  }),
);

export const uploadDatasetAsTablePayloadSchema = z.object({
  datasetIdentifier: z.string(),
  datasetRows: z.array(uploadDatasetRowPayloadSchema),
});
