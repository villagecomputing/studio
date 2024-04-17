import { z } from 'zod';

export const approveAllSchema = z.object({
  datasetId: z.string(),
});
