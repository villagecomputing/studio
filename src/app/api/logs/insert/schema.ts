import { experimentStepPayloadSchema } from '@/app/api/experiment/[experimentId]/insert/schema';
import { z } from 'zod';

export const insertLogsPayloadSchema = z.object({
  steps: z.array(experimentStepPayloadSchema),
  accuracy: z.union([z.number(), z.null()]).optional(),
  inputs: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    }),
  ),
  fingerprint: z.string(),
  name: z.string(),
  description: z.optional(z.string()),
  parameters: z.record(z.any()),
});
