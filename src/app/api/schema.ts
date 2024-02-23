import { z } from 'zod';

export const groundTruthColumnContentSchema = z.string();

export const columnHeadersSchema = z.object({
  index: z.number(),
  name: z.string(),
});

export const emptyObjectSchema = z.object({});
