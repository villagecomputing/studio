'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '@/app/(authenticated)/components/data-table/constants';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { useCallback, useEffect, useRef } from 'react';
import { useGridOperations } from '../hooks/useGridOperations';
import { DateRangeFilter, FetchLogsResult, LogsRow } from '../types';

import { onFilterChanged } from '@/app/(authenticated)/common/gridUtils';
import {
  CustomNoRowsOverlay,
  CustomNoRowsOverlayParams,
} from '@/app/(authenticated)/components/no-rows-overlay/NoRowsOverlay';
import { IRowNode } from 'ag-grid-community';
import LogsRowInspector from './LogsRowInspector/LogsRowInspector';
import { useLogsTableContext } from './LogsTableContext';

type LogsTableProps = FetchLogsResult & DateRangeFilter;

const LogsTable = (props: LogsTableProps) => {
  const context = useLogsTableContext(props);
  const {
    columnTypes,
    getRowId,
    navigateToNextCell,
    isExternalFilterPresent,
    doesExternalFilterPass,
  } = useGridOperations();
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
          isExternalFilterPresent: useCallback(
            () => isExternalFilterPresent(props.dateRange),
            [props.dateRange, isExternalFilterPresent],
          ),
          doesExternalFilterPass: useCallback(
            (node: IRowNode<LogsRow>) =>
              doesExternalFilterPass(node, props.dateRange),
            [props.dateRange, doesExternalFilterPass],
          ),
          onFilterChanged: onFilterChanged,
          noRowsOverlayComponent: CustomNoRowsOverlay,
          noRowsOverlayComponentParams: {
            resetFilter: () => props.setDateRange(undefined),
            isFilterPresent: isExternalFilterPresent(props.dateRange),
            text: 'No records found. Adjust your filters or reset them to view more results.',
          } as CustomNoRowsOverlayParams,
        }}
      />
    </>
  );
};

export default LogsTable;
