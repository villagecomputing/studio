import { z } from 'zod';
import { columnHeadersSchema } from '../../schema';

export const uploadDatasetPayloadSchema = z.object({
  datasetTitle: z.string(),
  groundTruthColumnIndex: z.number(),
  groundTruthColumnContent: z.array(z.string()),
  columnHeaders: z.array(columnHeadersSchema),
  totalNumberOfRows: z.number(),
});
