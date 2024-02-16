'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { GridOptions } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { SparkleIcon, TagIcon } from 'lucide-react';
import { useRef } from 'react';
import CustomHeaderComponent, {
  HeaderComponentParams,
} from './CustomHeaderComponent';

type DataSetTableProps<TData> = {
  data: TData[];
};

export default function DataSetTable<TData>(props: DataSetTableProps<TData>) {
  const { data } = props;
  const tableRef = useRef<AgGridReact>(null);

  const columnDefs: GridOptions['columnDefs'] = [
    {
      field: 'launch_success',
      headerName: 'Launch Success',
      headerComponent: CustomHeaderComponent,
    },
    {
      field: 'flight_number',
      headerName: 'Flight Number',
      headerComponent: CustomHeaderComponent,
    },
    {
      field: 'mission_name',
      headerName: 'Mission Name',
      headerComponent: CustomHeaderComponent,
      headerComponentParams: {
        leftSideIcon: <TagIcon size={14} />,
        tableRef,
      } as HeaderComponentParams,
    },
    {
      field: 'launch_year',
      headerName: 'Launch Year',
      headerComponent: CustomHeaderComponent,
    },
    {
      field: 'launch_date_utc',
      headerName: 'Launch Date',
      headerComponent: CustomHeaderComponent,
    },
    {
      field: 'details',
      headerName: 'Details',
      headerComponent: CustomHeaderComponent,
    },
    {
      field: 'rocket.rocket_name',
      headerName: 'Rocket Name',
      pinned: 'right',
      headerComponent: CustomHeaderComponent,
      headerComponentParams: {
        leftSideIcon: <SparkleIcon size={14} />,
        tableRef,
      } as HeaderComponentParams,
    },
  ];

  return (
    <DataTable<TData>
      tableRef={tableRef}
      agGridProps={{
        rowData: data,
        columnDefs,
      }}
    />
  );
}
