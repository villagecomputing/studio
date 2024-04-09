'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '@/app/(authenticated)/components/data-table/constants';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { useEffect, useRef } from 'react';
import { useGridOperations } from '../hooks/useGridOperations';
import { FetchLogsResult, LogsRow } from '../types';

import LogsRowInspector from './LogsRowInspector/LogsRowInspector';
import { useLogsTableContext } from './LogsTableContext';

const LogsTable = (props: FetchLogsResult) => {
  const context = useLogsTableContext(props);
  const { columnTypes, getRowId, navigateToNextCell } = useGridOperations();
  const gridRef = useRef<AgGridReactType<LogsRow>>(null);
  useEffect(() => {
    if (!gridRef.current) {
      return;
    }
    context.gridRef.current = gridRef.current;
  }, [gridRef, context.gridRef]);

  return (
    <>
      <LogsRowInspector context={context} />
      <DataTable<LogsRow>
        theme="ag-theme-dataset"
        gridRef={gridRef}
        className={
          context.inspectorRowIndex !== null ? 'small-dataset-table-view' : ''
        }
        agGridProps={{
          ...DEFAULT_GRID_OPTIONS,
          getRowId,
          context,
          rowData: props.rowData,
          columnDefs: context.displayableColumnDefs,
          columnTypes,
          navigateToNextCell,
        }}
      />
    </>
  );
};

export default LogsTable;
