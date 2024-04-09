import { z } from 'zod';

// Clerck payload structure documentation: https://clerk.com/docs/integrations/webhooks/overview
export const clerkUserPayloadSchema = z.object({
  data: z.object({
    id: z.string(),
  }),
  type: z.string(),
  object: z.string(),
});
