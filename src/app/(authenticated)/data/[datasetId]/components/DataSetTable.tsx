'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import { AGGridDataset } from '../types';
import {
  getTableColumnTypes,
  getTableDataTypeDefinitions,
  onTableCellValueChanged,
} from '../utils';
import { useDatasetTableContext } from './DatasetTableContext';

export default function DataSetTable(props: AGGridDataset) {
  const { rowData, columnDefs, pinnedBottomRowData } = props;
  const tableRef = useRef<AgGridReact>(null);
  const context = useDatasetTableContext(props);

  return (
    <DataTable
      theme="ag-theme-dataset"
      tableRef={tableRef}
      agGridProps={{
        rowData,
        columnDefs,
        context,
        pinnedBottomRowData,
        columnTypes: getTableColumnTypes(),
        dataTypeDefinitions: getTableDataTypeDefinitions(),
        reactiveCustomComponents: true,
        onCellValueChanged: onTableCellValueChanged,
      }}
    />
  );
}
