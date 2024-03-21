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

// Ideally the creation of a dynamic experiment table should be a separate endpoint (experiment/new) but
// due to limitations of the SDK, ATM (mv1) we can only create the dynamic table during the insert call
export const createExperimentPayloadSchema = z.object({
  id: z.string(),
  outputFieldsByMetadata: z.record(z.array(z.string())),
});
