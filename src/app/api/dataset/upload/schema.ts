import { z } from 'zod';

export const uploadDatasetPayloadSchema = z.object({
  datasetTitle: z.string(),
  groundTruthColumnIndex: z.number(),
});
