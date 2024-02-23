import { ObjectParseResult } from '@/lib/services/DatasetParser';
import { AGGridDataset } from './types';

export function convertToAGGridData(
  data: ObjectParseResult,
): AGGridDataset<unknown> {
  return {
    columndDefs: data.headers.map((header) => ({ field: header })),
    rowData: data.rows,
  };
}
