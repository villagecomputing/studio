'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import { AGGridDataset } from '../types';

type DataSetTableProps<TData> = {
  data: AGGridDataset<TData>;
};

export default function DataSetTable<TData>(props: DataSetTableProps<TData>) {
  const { data } = props;
  const tableRef = useRef<AgGridReact>(null);

  return (
    <DataTable<TData>
      theme="ag-theme-dataset"
      tableRef={tableRef}
      agGridProps={{
        rowData: data.rowData,
        columnDefs: data.columnDefs,
      }}
    />
  );
}
