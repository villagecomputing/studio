import { z } from 'zod';

export const newDatasetPayloadSchema = z.object({
  datasetName: z.string(),
  columns: z.array(z.string()),
  groundTruth: z.array(z.string()),
});

export const newDatasetResponseSchema = z.object({
  id: z.number(),
});
