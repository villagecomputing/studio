import { z } from 'zod';

export const experimentListResponseSchema = z.array(
  z.object({
    uuid: z.string(),
    name: z.string(),
    created_at: z.string(),
    Dataset_list: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
);
