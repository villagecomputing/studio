import { z } from 'zod';

export const datasetListResponseSchema = z.array(
  z.object({
    id: z.number(),
    file_name: z.string(),
    file_location: z.string(),
    total_rows: z.number(),
    created_at: z.string(),
  }),
);
