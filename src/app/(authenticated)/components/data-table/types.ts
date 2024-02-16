import { AgGridReact, AgGridReactProps } from 'ag-grid-react';

export interface DataTableProps<TData> {
  tableRef?: React.RefObject<AgGridReact>;
  agGridProps: AgGridReactProps<TData>;
}
