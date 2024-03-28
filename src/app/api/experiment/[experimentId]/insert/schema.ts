import { z } from 'zod';

export const experimentStepPayloadSchema = z.object({
  name: z.string(),
  metadata: z
    .object({
      latency: z.number(),
    })
    .and(z.record(z.string(), z.union([z.number(), z.string()]))),
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
