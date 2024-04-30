import { z } from 'zod';

export const newDatasetPayloadSchema = z.object({
  datasetName: z.string(),
  columns: z.array(z.string()),
  groundTruths: z.array(z.string()),
  logsUuid: z.union([z.string(), z.null()]).optional(),
});

export const newDatasetResponseSchema = z.object({
  id: z.string(),
});
