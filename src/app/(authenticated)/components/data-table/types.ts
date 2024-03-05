import { AgGridReact, AgGridReactProps } from 'ag-grid-react';

export interface DataTableProps<TData> {
  agGridProps: AgGridReactProps<TData>;
  theme?: 'ag-theme-dataset-list' | 'ag-theme-dataset';
  gridRef?: React.MutableRefObject<AgGridReact<TData> | null>;
}
