import { z } from 'zod';

export const experimentListResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    created_at: z.string(),
    Dataset: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
);
