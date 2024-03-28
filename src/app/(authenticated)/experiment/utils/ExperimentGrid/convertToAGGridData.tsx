import { DatasetTableColumnProps } from '@/app/(authenticated)/data/[datasetId]/types';
import { ROW_ID_FIELD_NAME } from '@/app/(authenticated)/data/utils/commonUtils';
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
  return tableColumns.map((tableColumn) => ({
    field: tableColumn.field,
    headerName: tableColumn.name,
    colId: tableColumn.id.toString(),
    type: tableColumn.type,
  }));
}

function getTableRows(rows: ExperimentRow[]): ExperimentRow[] {
  return rows.map((row, index) => ({
    ...row,
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
