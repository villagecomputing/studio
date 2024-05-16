import { z } from 'zod';

export const experimentListResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    created_at: z.string(),
    groupId: z.string(),
    groupName: z.nullable(z.string()),
    pipelineMetadata: z.string(),
    latencyP50: z.number(),
    latencyP90: z.number(),
    runtime: z.number(),
    totalCost: z.number(),
    avgAccuracy: z.number(),
    totalRows: z.number(),
    Dataset: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
);
