'use server';
import ApiUtils from '@/lib/services/ApiUtils';
import { ParserError } from '@/lib/services/DatasetParser';
import { permanentRedirect } from 'next/navigation';

import { experimentStepMetadata } from '@/app/api/experiment/[experimentId]/insert/schema';
import { calculatePercentile } from '@/lib/services/ApiUtils/experiment/utils';
import { Enum_Dynamic_logs_static_fields } from '@/lib/services/ApiUtils/logs/utils';
import { Enum_Logs_Column_Type } from '@/lib/types';
import { auth } from '@clerk/nextjs';
import { compact } from 'lodash';
import {
  StepMetadataColumn,
  StepsMetadataPercentiles,
} from '../../experiment/[experimentId]/types';
import LogsGrid from '../utils/LogsGrid';
import { FetchLogsResult } from './types';

export const fetchLogs = async (logsId: string): Promise<FetchLogsResult> => {
  try {
    if (!logsId) {
      permanentRedirect('/logs');
    }
    const { userId: externalUserId } = auth();
    const userId = externalUserId
      ? (await ApiUtils.getUserByExternalUserId(externalUserId)).id
      : null;
    const logs = await ApiUtils.getLogsById(logsId, userId);

    const metadataColumn = {
      field: 'metadata',
      name: 'Metadata',
      id: -1,
      type: Enum_Logs_Column_Type.ROW_METADATA,
    };
    const checkboxSelectionColumn = {
      field: Enum_Dynamic_logs_static_fields.CHECKBOX_SELECTION,
      name: '',
      id: -1,
      type: Enum_Logs_Column_Type.CHECKBOX_SELECTION,
    };

    const stepMetadataColumns = logs.columns.filter(
      (column) => column.type === Enum_Logs_Column_Type.STEP_METADATA,
    );
    const stepsMetadataPercentiles = getStepsMetadataPercentiles(
      stepMetadataColumns,
      logs.rows,
    );
    const timestampColumns = logs.columns.filter(
      (column) => column.type === Enum_Logs_Column_Type.TIMESTAMP,
    );
    const inputColumns = logs.columns.filter(
      (column) => column.type === Enum_Logs_Column_Type.INPUT,
    );
    const columns = logs.columns.filter(
      (column) =>
        column.type !== Enum_Logs_Column_Type.INPUT &&
        column.type !== Enum_Logs_Column_Type.TIMESTAMP,
    );
    return {
      logsName: logs.name,
      description: logs.description || undefined,
      latencyP50: logs.latencyP50,
      latencyP90: logs.latencyP90,
      latencyP25: logs.latencyP25,
      latencyP75: logs.latencyP75,
      runtime: logs.runtime,
      cost: logs.cost,
      costP25: logs.costP25,
      costP75: logs.costP75,
      parameters: logs.parameters,
      accuracy: logs.accuracy,
      stepsMetadataPercentiles,
      datasetUuid: logs.datasetUuid ?? undefined,
      datasetName: logs.datasetName ?? undefined,
      ...LogsGrid.convertToAGGridData({
        logsId: logs.id,
        columns: [
          checkboxSelectionColumn,
          ...timestampColumns,
          ...inputColumns,
          metadataColumn,
          ...columns,
        ],
        rows: logs.rows,
      }),
    };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error((error as ParserError).message);
  }
};

const getStepsMetadataPercentiles = (
  stepMetadataColumns: StepMetadataColumn[],
  rows: Record<string, string | null>[],
) => {
  const stepsMetadataPercentiles: StepsMetadataPercentiles = {};
  stepMetadataColumns.forEach((column) => {
    const stepMetadata = compact(
      rows.map((row) => {
        if (!row[column.field]) {
          return null;
        }
        const metadata = JSON.parse(row[column.field] as string);
        const { latency, input_cost, output_cost, success } =
          experimentStepMetadata.parse(metadata);
        return success
          ? { latency, cost: (input_cost ?? 0) + (output_cost ?? 0) }
          : null;
      }),
    );
    const sortedLatency = stepMetadata
      .map((rowMetadata) => rowMetadata.latency)
      .sort((a, b) => a - b);

    const sortedCost = stepMetadata
      .map((rowMetadata) => rowMetadata.cost)
      .sort((a, b) => a - b);

    stepsMetadataPercentiles[column.field] = {
      costP25: calculatePercentile(sortedCost, 25),
      costP75: calculatePercentile(sortedCost, 75),
      latencyP25: calculatePercentile(sortedLatency, 25),
      latencyP75: calculatePercentile(sortedLatency, 75),
    };
  });

  return stepsMetadataPercentiles;
};
