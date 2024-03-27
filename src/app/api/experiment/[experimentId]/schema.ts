import { Enum_Experiment_Column_Type } from '@/lib/types';
import { z } from 'zod';

const ExperimentTableColumnPropsSchema = z.object({
  name: z.string(),
  id: z.number(),
  field: z.string(),
  type: z.nativeEnum(Enum_Experiment_Column_Type),
});

const ExperimentRowSchema = z.record(z.string(), z.string());

export const experimentViewResponseSchema = z.object({
  uuid: z.string(),
  created_at: z.date(),
  name: z.string(),
  description: z.string(),
  columns: z.array(ExperimentTableColumnPropsSchema),
  rows: z.array(ExperimentRowSchema),
});
