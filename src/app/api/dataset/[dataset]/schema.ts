import { z } from 'zod';

export const datasetViewResponseSchema = z.object({
  id: z.number(),
  file_location: z.string(),
  file_name: z.string(),
  total_rows: z.number(),
  Dataset_column: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      type: z.string(),
      index: z.number(),
      Ground_truth_cell: z.array(
        z.object({
          id: z.number(),
          status: z.string(),
          content: z.string(),
          column_id: z.number(),
        }),
      ),
    }),
  ),
});
