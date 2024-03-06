import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { z } from 'zod';

const TableColumnPropsSchema = z.object({
  name: z.string(),
  id: z.number(),
  field: z.string(),
  type: z.nativeEnum(ENUM_Column_type),
});

const DatasetRowSchema = z.record(
  z.union([
    z.string(),
    z.object({
      content: z.string(),
      id: z.number(),
      status: z.nativeEnum(ENUM_Ground_truth_status),
    }),
  ]),
);

export const datasetViewResponseSchema = z.object({
  id: z.number(),
  file_location: z.string(),
  file_name: z.string(),
  total_rows: z.number(),
  file_size: z.number(),
  file_type: z.string(),
  created_at: z.date(),
  columns: z.array(TableColumnPropsSchema),
  rows: z.array(DatasetRowSchema),
});
