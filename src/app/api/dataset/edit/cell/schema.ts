import { ENUM_Ground_truth_status } from '@/lib/types';
import { z } from 'zod';

export const editDatasetCellSchema = z.object({
  groundTruthCellId: z.number(),
  content: z.string(),
  status: z.optional(z.nativeEnum(ENUM_Ground_truth_status)),
});
