import { z } from 'zod';

export const experimentListResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    created_at: z.string(),
    groupId: z.number(),
    pipelineMetadata: z.string(),
    avgLatencyP50: z.number(),
    avgLatencyP90: z.number(),
    totalCost: z.number(),
    totalAccuracy: z.number(),
    totalRows: z.number(),
    Dataset: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
);
