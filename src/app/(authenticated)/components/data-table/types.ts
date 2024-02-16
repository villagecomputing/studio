import { AgGridReactProps } from 'ag-grid-react';

export interface DataTableProps<TData> {
  agGridProps: AgGridReactProps<TData>;
}
