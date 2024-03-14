import { z } from 'zod';

export const addDataPayloadSchema = z.object({
  datasetName: z.string(),
  datasetRows: z.array(z.record(z.string())),
});
