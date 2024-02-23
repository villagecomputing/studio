import { z } from 'zod';
import {
  columnHeadersSchema,
  groundTruthColumnContentSchema,
} from '../../schema';

export const uploadDatasetPayloadSchema = z.object({
  datasetTitle: z.string(),
  groundTruthColumnIndex: z.number(),
  groundTruthColumnContent: z.array(groundTruthColumnContentSchema),
  columnHeaders: z.array(columnHeadersSchema),
  totalNumberOfRows: z.number(),
});
