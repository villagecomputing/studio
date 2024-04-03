import { Enum_Experiment_Column_Type } from '@/lib/types';
import { z } from 'zod';

const ExperimentTableColumnPropsSchema = z.object({
  name: z.string(),
  id: z.number(),
  field: z.string(),
  type: z.nativeEnum(Enum_Experiment_Column_Type),
});

const ExperimentRowSchema = z.record(z.string());

export const experimentViewResponseSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  name: z.string(),
  description: z.string(),
  columns: z.array(ExperimentTableColumnPropsSchema),
  rows: z.array(ExperimentRowSchema),
  dataset: z.object({
    name: z.string(),
    id: z.string(),
  }),
  latencyP50: z.number(),
  latencyP90: z.number(),
  runtime: z.number(),
  cost: z.number(),
  accuracy: z.number(),
  parameters: z.string(),
  costP25: z.number(),
  costP75: z.number(),
  latencyP25: z.number(),
  latencyP75: z.number(),
});
