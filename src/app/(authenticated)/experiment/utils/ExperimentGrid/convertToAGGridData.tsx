import { DatasetTableColumnProps } from '@/app/(authenticated)/data/[datasetId]/types';
import { ROW_ID_FIELD_NAME } from '@/app/(authenticated)/data/utils/commonUtils';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { ColDef } from 'ag-grid-community';
import {
  AGGridExperiment,
  ConvertToAGGridDataProps,
  ExperimentRow,
  ExperimentTableColumnProps,
} from '../../[experimentId]/types';

function getTableColumnDefs(
  tableColumns: (ExperimentTableColumnProps | DatasetTableColumnProps)[],
): ColDef[] {
  const columns = tableColumns.map(
    (tableColumn): ColDef => ({
      field: tableColumn.field,
      headerName: tableColumn.name,
      colId: tableColumn.id.toString(),
      type: tableColumn.type,
      ...(tableColumn.type === Enum_Experiment_Column_Type.ROW_METADATA
        ? { minWidth: 210 }
        : {}),
    }),
  );
  return columns;
}

function getTableRows(rows: ExperimentRow[]): ExperimentRow[] {
  return rows.map((row, index) => ({
    ...row,
    metadata: '',
    [ROW_ID_FIELD_NAME]: index.toString(),
  }));
}

export function convertToAGGridData(
  data: ConvertToAGGridDataProps,
): AGGridExperiment {
  return {
    experimentId: data.experimentId,
    columnDefs: getTableColumnDefs(data.columns),
    rowData: getTableRows(data.rows),
  };
}
