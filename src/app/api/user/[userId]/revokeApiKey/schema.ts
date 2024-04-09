import { z } from 'zod';

export const userRevokeApiKeyPayloadSchema = z.object({
  api_key: z.string(),
});
