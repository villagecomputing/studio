import { z } from 'zod';

export const logsToDatasetPayloadSchema = z.object({
  rows: z.array(
    z.object({
      logs_row_index: z.string(),
      inputs: z.record(z.string()),
      outputs: z.record(z.string()),
    }),
  ),
});

export const logsToDatasetViewResponse = z.object({
  datasetUuid: z.string(),
  logsUuid: z.string(),
  logRowsToDatasetRows: z.record(z.string()),
});
