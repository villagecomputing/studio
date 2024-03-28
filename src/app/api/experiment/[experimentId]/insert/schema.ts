import { z } from 'zod';

export const experimentStepPayloadSchema = z.object({
  name: z.string(),
  metadata: z
    .object({
      latency: z.number(),
      success: z.boolean(),
      error: z.union([z.string(), z.null()]),
    })
    .and(
      z.record(
        z.string(),
        z.union([z.number(), z.string(), z.boolean(), z.null()]),
      ),
    ),
  outputs: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    }),
  ),
});

export const insertExperimentPayloadSchema = z.object({
  steps: z.array(experimentStepPayloadSchema),
});
