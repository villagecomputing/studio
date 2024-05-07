import { ENUM_Column_type } from '@/lib/types';
import { ColDef } from 'ag-grid-community';
import CustomHeaderComponent from '../../[datasetId]/components/CustomHeaderComponent';
import {
  AGGridDataset,
  ConvertToAGGridDataProps,
  DatasetRow,
  DatasetTableColumnProps,
} from '../../[datasetId]/types';
import { ROW_ID_FIELD_NAME } from '../commonUtils';

function getTableRows(rows: DatasetRow[]): DatasetRow[] {
  return rows.map((row, index) => ({
    ...row,
    [ROW_ID_FIELD_NAME]: index.toString(),
  }));
}

function getEmptyRow(colHeaders: DatasetTableColumnProps[]) {
  const emptyRow: DatasetRow = {};
  colHeaders.forEach((column) => {
    emptyRow[column.field] = '';
  });
  return emptyRow;
}

function getTableColumnDefs(tableColumns: DatasetTableColumnProps[]): ColDef[] {
  return tableColumns.map((tableColumn) => ({
    field: tableColumn.field,
    headerName:
      tableColumn.type !== ENUM_Column_type.TIMESTAMP
        ? tableColumn.name
        : 'Timestamp',
    headerComponent: CustomHeaderComponent,
    colId: tableColumn.id.toString(),
    type: tableColumn.type,
    width: tableColumn.type === ENUM_Column_type.GROUND_TRUTH ? 230 : 200,
  }));
}

export function convertToAGGridData(
  data: ConvertToAGGridDataProps,
): AGGridDataset {
  return {
    datasetId: data.datasetId,
    columnDefs: getTableColumnDefs(data.columns),
    rowData: getTableRows(data.rows),
    pinnedBottomRowData: [getEmptyRow(data.columns)],
  };
}
