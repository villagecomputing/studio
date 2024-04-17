import { z } from 'zod';

export const userGetApiKeyResponseSchema = z.object({
  api_key: z.string().optional(),
});
