import { z } from 'zod';

export const addDataPayloadSchema = z.object({
  datasetRows: z.array(
    z.record(z.union([z.string(), z.date(), z.null(), z.number()])),
  ),
});
