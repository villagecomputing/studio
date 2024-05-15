import { z } from 'zod';

export const addDataPayloadSchema = z.object({
  datasetRows: z.array(
    z
      .object({
        fingerprint: z.string(),
      })
      .catchall(z.union([z.string(), z.null(), z.number(), z.date()])),
  ),
});
