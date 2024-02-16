import { AgGridReactProps } from 'ag-grid-react';

export const DEFAULT_COLUMN_DEFINITION: AgGridReactProps['defaultColDef'] = {
  sortable: true,
  filter: false,
  resizable: true,
  suppressMovable: true,
  enableRowGroup: false,
};
