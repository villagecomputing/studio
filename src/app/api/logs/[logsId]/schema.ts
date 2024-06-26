import { Enum_Logs_Column_Type } from '@/lib/types';
import { z } from 'zod';

export const LogsTableColumnPropsSchema = z.object({
  name: z.string(),
  id: z.number(),
  field: z.string(),
  type: z.nativeEnum(Enum_Logs_Column_Type),
});

const LogsRowSchema = z.record(z.union([z.string(), z.null()]));

export const logsViewResponseSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  name: z.string(),
  description: z.string(),
  columns: z.array(LogsTableColumnPropsSchema),
  rows: z.array(LogsRowSchema),
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
  datasetUuid: z.union([z.string(), z.null()]).optional(),
  datasetName: z.union([z.string(), z.null()]).optional(),
});
