import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import { guardStringEnum } from '@/lib/typeUtils';
import { Enum_Logs_Column_Type } from '@/lib/types';
import DatabaseUtils from '../../DatabaseUtils';
import { ENUM_ORDER_DIRECTION } from '../../DatabaseUtils/types';
import { getDynamicTableContent } from '../common/getDynamicTableContent';
import { getExperimentMetadataPercentile } from '../experiment/getExperiment';
import { getLogsDetails } from './getLogsDetails';
import { Enum_Dynamic_logs_static_fields } from './utils';

export async function getLogsById(
  logsId: string,
  userId: string | null,
): Promise<ResultSchemaType[ApiEndpoints.logsView]> {
  if (!logsId) {
    throw new Error('experimentId is required');
  }

  const logsDetails = await getLogsDetails(logsId, userId);
  if (!logsDetails) {
    throw new Error('No logs for id');
  }
  if (userId && !logsDetails) {
    throw new Error('Invalid logs id');
  }
  const logsContent = await getDynamicTableContent({
    tableName: logsId,
    sortBy: {
      field: Enum_Dynamic_logs_static_fields.CREATED_AT,
      direction: ENUM_ORDER_DIRECTION.DESC,
    },
  });

  // Map the columns
  const columns = logsDetails.Logs_column.map((column) => {
    return {
      name: column.name,
      id: column.id,
      field: column.field,
      type: guardStringEnum(Enum_Logs_Column_Type, column.type),
    };
  });

  let rowsWithAccuracyCount = 0;
  try {
    rowsWithAccuracyCount = Number(
      await DatabaseUtils.selectAggregation(
        logsId,
        { func: 'COUNT' },
        { accuracy: { isNotNull: true } },
      ),
    );
  } catch (_e) {}

  const logsMetadataPercentile = await getExperimentMetadataPercentile(logsId);

  return {
    id: logsDetails.uuid,
    name: logsDetails.name,
    description: logsDetails.description || '',
    latencyP50: logsDetails.latency_p50,
    latencyP90: logsDetails.latency_p90,
    runtime: logsDetails.total_latency,
    cost: logsDetails.total_cost,
    accuracy: rowsWithAccuracyCount
      ? logsDetails.total_accuracy / rowsWithAccuracyCount
      : 0,
    parameters: logsDetails.pipeline_metadata,
    createdAt: logsDetails.created_at,
    columns: columns,
    rows: logsContent,
    datasetUuid: logsDetails.Dataset[0]?.uuid,
    datasetName: logsDetails.Dataset[0]?.name,
    ...logsMetadataPercentile,
  };
}
