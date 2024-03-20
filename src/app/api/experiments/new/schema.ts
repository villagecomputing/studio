import { z } from 'zod';

export const newExperimentPayloadSchema = z.object({
  datasetId: z.number(),
  name: z.string(),
  parameters: z.record(z.any()),
});

export const newExperimentResponseSchema = z.object({
  id: z.number(),
});
