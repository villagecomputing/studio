import { z } from 'zod';

export const datasetListResponseSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    total_rows: z.string(),
    created_at: z.string(),
  }),
);
