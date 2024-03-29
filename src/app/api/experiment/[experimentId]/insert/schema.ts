import { z } from 'zod';

export const experimentStepMetadata = z
  .object({
    latency: z.number(),
    success: z.boolean(),
    error: z.union([z.string(), z.null()]),
    input_tokens: z.number().optional(),
    output_tokens: z.number().optional(),
    input_cost: z.number().optional(),
    output_cost: z.number().optional(),
  })
  .passthrough();

export const experimentStepPayloadSchema = z.object({
  name: z.string(),
  metadata: experimentStepMetadata,
  outputs: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    }),
  ),
});
export type ExperimentStepMetadata = z.infer<typeof experimentStepMetadata>;

export const insertExperimentPayloadSchema = z.object({
  steps: z.array(experimentStepPayloadSchema),
});
