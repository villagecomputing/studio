import { z } from 'zod';

export const logsToDatasetPayloadSchema = z.object({
  datasetName: z.string(),
  logsRowIndices: z.array(z.string()),
});

export const logsToDatasetViewResponse = z.object({
  datasetUuid: z.string(),
  logsUuid: z.string(),
  logRowsToDatasetRows: z.record(z.string()),
});
