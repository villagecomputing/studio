import { ENUM_Column_type } from '@/lib/types';
import { z } from 'zod';

export const editDatasetColumnSchema = z.object({
  columnId: z.number(),
  type: z.optional(z.nativeEnum(ENUM_Column_type)),
  name: z.optional(z.string()),
});
