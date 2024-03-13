import { ENUM_Ground_truth_status } from '@/lib/types';
import { z } from 'zod';

export const editGroundTruthCellSchema = z
  .object({
    datasetId: z.number(),
    rowId: z.number(),
    content: z.string().optional(),
    status: z.nativeEnum(ENUM_Ground_truth_status).optional(),
  })
  .refine((data) => data.content || data.status, {
    message: "Either 'content' or 'status' must be provided",
  });
