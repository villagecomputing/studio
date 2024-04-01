import { z } from 'zod';

export const addDataPayloadSchema = z.object({
  datasetRows: z.array(z.record(z.string())),
});
