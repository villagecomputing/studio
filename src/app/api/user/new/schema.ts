import { z } from 'zod';

export const newUserPayloadSchema = z.object({
  userExternalId: z.string(),
});

export const newUserResponseSchema = z.object({
  id: z.string(),
});
