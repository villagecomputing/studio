import { z } from 'zod';

export const experimentListResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    created_at: z.string(),
    groupId: z.number(),
    pipelineMetadata: z.string(),
    totalRows: z.number(),
    Dataset: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
);
