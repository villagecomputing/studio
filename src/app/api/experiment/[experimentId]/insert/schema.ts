import { z } from 'zod';

export const experimentStepPayloadSchema = z.object({
  name: z.string(),
  metadata: z.record(z.string()),
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
