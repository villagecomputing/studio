import { z } from 'zod';

export const userViewResponseSchema = z.object({
  id: z.string(),
  external_id: z.string(),
  created_at: z.date(),
  deleted_at: z.date().optional(),
});
