import { z } from 'zod';

export const logsListResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    createdAt: z.string(),
    pipelineMetadata: z.string(),
    latencyP50: z.number(),
    latencyP90: z.number(),
    runtime: z.number(),
    totalCost: z.number(),
    avgAccuracy: z.number(),
    totalRows: z.number(),
  }),
);
