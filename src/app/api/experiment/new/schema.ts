import { z } from 'zod';

const alphanumericNoSpaces = z
  .string()
  .refine((value) => /^[a-zA-Z0-9]*$/.test(value), {
    message: 'GroupId must be alphanumeric with no spaces',
  });

export const newExperimentPayloadSchema = z.object({
  datasetId: z.string(),
  name: z.string(),
  groupId: alphanumericNoSpaces,
  description: z.optional(z.string()),
  parameters: z.record(z.any()),
});

export const newExperimentResponseSchema = z.object({
  id: z.string(),
});
