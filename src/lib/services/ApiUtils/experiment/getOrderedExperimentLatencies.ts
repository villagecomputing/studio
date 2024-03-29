import DatabaseUtils from '../../DatabaseUtils';
import { ENUM_ORDER_DIRECTION } from '../../DatabaseUtils/types';

import { DYNAMIC_EXPERIMENT_LATENCY_FIELD } from './utils';

export default async function getOrderedExperimentLatencies(
  experimentId: string,
): Promise<number[]> {
  if (!experimentId) {
    throw new Error('experimentTableName is required');
  }

  const selectFields = [DYNAMIC_EXPERIMENT_LATENCY_FIELD];
  const orderBy = {
    field: DYNAMIC_EXPERIMENT_LATENCY_FIELD,
    direction: ENUM_ORDER_DIRECTION.ASC,
  };

  try {
    const result = await DatabaseUtils.select<Record<string, string>>(
      experimentId,
      selectFields,
      undefined,
      orderBy,
    );
    return result.map((row) => {
      return Number(row[DYNAMIC_EXPERIMENT_LATENCY_FIELD]);
    });
  } catch (error) {
    // Check if the error is because the table doesn't exist
    if (error instanceof Error && 'code' in error && error.code === 'P2010') {
      return [];
    } else {
      throw error;
    }
  }
}
