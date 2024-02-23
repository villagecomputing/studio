import { z } from 'zod';

export const columnHeadersSchema = z.object({
  index: z.number(),
  name: z.string(),
});

export const emptyObjectSchema = z.object({});
