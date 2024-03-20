import { z } from 'zod';

export const uploadDatasetPayloadSchema = z.object({
  datasetTitle: z.string(),
  groundTruthColumnIndex: z.number(),
  blankColumnTitle: z.optional(z.string()),
});

export const uploadDatasetResultSchema = z.object({
  datasetId: z.string(),
});
