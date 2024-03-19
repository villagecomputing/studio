import { AgGridReactProps } from 'ag-grid-react';

export const DEFAULT_COLUMN_DEFINITION: AgGridReactProps['defaultColDef'] = {
  sortable: true,
  filter: false,
  resizable: true,
  suppressMovable: true,
  enableRowGroup: false,
};

export const DEFAULT_GRID_OPTIONS: AgGridReactProps = {
  rowSelection: 'single',
  enableCellTextSelection: true,
  reactiveCustomComponents: true,
};
