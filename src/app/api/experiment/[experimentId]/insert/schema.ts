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
    prompt: z.string().optional(),
  })
  .passthrough();

export const experimentStepOutputMapping = experimentStepMetadata.extend({
  output_column_fields: z.array(z.string()),
});

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
export type ExperimentStep = z.infer<typeof experimentStepPayloadSchema>;

export const insertExperimentPayloadSchema = z.object({
  steps: z.array(experimentStepPayloadSchema),
  index: z.number(),
  accuracy: z.union([z.number(), z.null()]).optional(),
});
