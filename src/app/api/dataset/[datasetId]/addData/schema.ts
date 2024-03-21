import { z } from 'zod';

export const addDataPayloadSchema = z.object({
  datasetId: z.string(),
  datasetRows: z.array(z.record(z.string())),
});
