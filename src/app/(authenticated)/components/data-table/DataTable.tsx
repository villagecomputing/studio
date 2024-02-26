'use client';
import { cn } from '@/lib/utils';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.min.css';
import { AgGridReact } from 'ag-grid-react';
import './ag-grid-custom-theme.css';
import { DEFAULT_COLUMN_DEFINITION } from './constants';
import { DataTableProps } from './types';

export default function DataTable<TData>(props: DataTableProps<TData>) {
  return (
    <div className={cn(['ag-theme-alpine', props.theme, 'w-full', 'h-full'])}>
      <AgGridReact
        defaultColDef={DEFAULT_COLUMN_DEFINITION}
        {...props.agGridProps}
      />
    </div>
  );
}
