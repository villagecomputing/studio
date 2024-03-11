import { z } from 'zod';

export const uploadDatasetRowPayloadSchema = z.array(
  z.object({
    columnName: z.string(),
    columnValue: z.string(),
  }),
);

export const uploadDatasetAsTablePayloadSchema = z.object({
  datasetName: z.string(),
  datasetRows: z.array(uploadDatasetRowPayloadSchema),
});
