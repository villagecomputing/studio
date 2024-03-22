import {
  AGGridExperiment,
  ConvertToAGGridDataProps,
} from '../../[experimentId]/types';

export function convertToAGGridData(
  data: ConvertToAGGridDataProps,
): AGGridExperiment {
  return {
    experimentId: data.experimentId,
    columnDefs: data.columns,
    rowData: data.rows,
  };
}
