'use client';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.min.css';
import { AgGridReact } from 'ag-grid-react';
import './ag-grid-custom-theme.css';
import { DEFAULT_COLUMN_DEFINITION } from './constants';
import { DataTableProps } from './types';

export default function DataTable<TData>(props: DataTableProps<TData>) {
  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        defaultColDef={DEFAULT_COLUMN_DEFINITION}
        {...props.agGridProps}
      />
    </div>
  );
}
