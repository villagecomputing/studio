import { z } from 'zod';

export const deleteUserPayloadSchema = z
  .object({
    id: z.string().optional(),
    userExternalId: z.string().optional(),
  })
  .refine((data) => data.id || data.userExternalId, {
    message: "Either 'id' or 'userExternalId' must be provided",
  });
