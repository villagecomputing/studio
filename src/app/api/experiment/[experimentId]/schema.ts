import { z } from 'zod';

const ExperimentTableColumnPropsSchema = z.object({
  name: z.string(),
  id: z.number(),
  field: z.string(),
  // TODO Change this to experiment column type ENUM
  type: z.string(),
});

const ExperimentRowSchema = z.record(z.string(), z.string());

export const experimentViewResponseSchema = z.object({
  uuid: z.string(),
  created_at: z.date(),
  name: z.string(),
  columns: z.array(ExperimentTableColumnPropsSchema),
  rows: z.array(ExperimentRowSchema),
});
