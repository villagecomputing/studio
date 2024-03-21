import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';

import { Enum_Experiment_Column_Type } from '@/lib/types';
import DatabaseUtils from '../../DatabaseUtils';
import { buildExperimentFields } from './utils';

export async function insertExperimentSteps(
  experimentId: string,
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert],
) {
  const stepFieldAndValues = buildExperimentFields(payload).filter(
    (field) => field.type !== Enum_Experiment_Column_Type.IDENTIFIER,
  );
  const valuesByField: Record<string, string> = {};
  stepFieldAndValues.forEach(
    (stepFieldAndValue) =>
      (valuesByField[stepFieldAndValue.field] = stepFieldAndValue.value || ''),
  );
  try {
    const result = await DatabaseUtils.insert(experimentId, [valuesByField]);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error inserting data');
  }
}
