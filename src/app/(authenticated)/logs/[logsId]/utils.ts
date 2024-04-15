import { experimentStepMetadata } from '@/app/api/experiment/[experimentId]/insert/schema';
import { LogsRow, StepMetadataColumn } from './types';

export const getLogsRowMetadata = (
  rowData: LogsRow,
  stepMetadataColumns: StepMetadataColumn[],
) => {
  let latencySum = 0;
  let costSum = 0;
  let inputTokensSum = 0;
  let outputTokensSum = 0;
  let stepError: { stepName?: string; error?: string | null } = {};

  for (const column of stepMetadataColumns) {
    const value = rowData[column.field];
    if (!value) {
      continue;
    }
    const metadata = JSON.parse(value);
    const {
      latency,
      input_cost,
      output_cost,
      input_tokens,
      output_tokens,
      success,
      error,
    } = experimentStepMetadata.parse(metadata);
    if (!success) {
      stepError = { stepName: column.name, error };
    }
    latencySum += latency;
    costSum += (input_cost ?? 0) + (output_cost ?? 0);
    inputTokensSum += input_tokens ?? 0;
    outputTokensSum += output_tokens ?? 0;
  }

  return {
    latencySum,
    costSum,
    inputTokensSum,
    outputTokensSum,
    stepError,
  };
};
