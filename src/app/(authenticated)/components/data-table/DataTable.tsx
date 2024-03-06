'use client';
import { cn } from '@/lib/utils';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.min.css';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useRef } from 'react';
import './ag-grid-custom-theme.css';
import { DEFAULT_COLUMN_DEFINITION } from './constants';
import { DataTableProps } from './types';

export default function DataTable<TData>(props: DataTableProps<TData>) {
  const gridRef = useRef<AgGridReact<TData>>(null);

  useEffect(() => {
    if (!props.gridRef) {
      return;
    }
    props.gridRef.current = gridRef.current;
  }, [gridRef, props.gridRef]);

  return (
    <div
      className={cn([
        'ag-theme-alpine',
        props.theme,
        'h-full',
        props.className,
      ])}
    >
      <AgGridReact
        ref={gridRef}
        defaultColDef={DEFAULT_COLUMN_DEFINITION}
        {...props.agGridProps}
      />
    </div>
  );
}
