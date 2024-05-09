'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '@/app/(authenticated)/components/data-table/constants';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useGridOperations } from '../hooks/useGridOperations';
import { FetchLogsResult, LogsRow } from '../types';

import {
  doesExternalFilterPass,
  isExternalFilterPresent,
  onFilterChanged,
} from '@/app/(authenticated)/common/gridUtils';
import { DateRangeFilter } from '@/app/(authenticated)/common/types';
import {
  CustomNoRowsOverlay,
  CustomNoRowsOverlayParams,
} from '@/app/(authenticated)/components/no-rows-overlay/NoRowsOverlay';
import { Enum_Dynamic_logs_static_fields } from '@/lib/services/ApiUtils/logs/utils';
import { IRowNode } from 'ag-grid-community';
import LogsRowInspector from './LogsRowInspector/LogsRowInspector';
import { useLogsTableContext } from './LogsTableContext';

export type LogsTableProps = FetchLogsResult &
  DateRangeFilter & {
    setRowIdsToCopyToDataset: Dispatch<SetStateAction<string[]>>;
  };

const LogsTable = (props: LogsTableProps) => {
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
          rowData: context.rows,
          columnDefs: context.displayableColumnDefs,
          columnTypes,
          navigateToNextCell,
          isExternalFilterPresent: useCallback(
            () => isExternalFilterPresent(props.dateRange),
            [props.dateRange, isExternalFilterPresent],
          ),
          doesExternalFilterPass: useCallback(
            (node: IRowNode<LogsRow>) => {
              if (!node.data) {
                return true;
              }
              return doesExternalFilterPass(
                node.data[
                  Enum_Dynamic_logs_static_fields.CREATED_AT
                ].toString(),
                props.dateRange,
              );
            },
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
