import { experimentStepPayloadSchema } from '@/app/api/experiment/[experimentId]/insert/schema';
import { z } from 'zod';

export const logsStepInputs = z.array(
  z.object({
    name: z.string(),
    value: z.string(),
  }),
);

export const insertLogsPayloadSchema = z.object({
  steps: z.array(experimentStepPayloadSchema),
  final_output_columns: z.array(z.string()).optional(),
  accuracy: z.union([z.number(), z.null()]).optional(),
  inputs: logsStepInputs,
  fingerprint: z.string(),
  name: z.string(),
  description: z.optional(z.string()),
  parameters: z.record(z.any()),
});
