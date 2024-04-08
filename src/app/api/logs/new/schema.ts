import { z } from 'zod';

export const newLogsPayloadSchema = z.object({
  name: z.string(),
  description: z.optional(z.string()),
  parameters: z.record(z.any()),
});

export const newLogsResponseSchema = z.object({
  id: z.string(),
});
