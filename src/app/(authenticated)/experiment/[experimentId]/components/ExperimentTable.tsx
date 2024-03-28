'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '@/app/(authenticated)/components/data-table/constants';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { useEffect, useRef } from 'react';
import { useGridOperations } from '../hooks/useGridOperations';
import { ExperimentRow, FetchExperimentResult } from '../types';
import { useExperimentTableContext } from './ExperimentTableContext';

const ExperimentTable = (props: FetchExperimentResult) => {
  const context = useExperimentTableContext(props);
  const { columnTypes, getRowId, navigateToNextCell } = useGridOperations();
  const gridRef = useRef<AgGridReactType<ExperimentRow>>(null);
  useEffect(() => {
    if (!gridRef.current) {
      return;
    }
    context.gridRef.current = gridRef.current;
  }, [gridRef, context.gridRef]);

  return (
    <>
      <DataTable<ExperimentRow>
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
          columnDefs: context.columnDefs,
          columnTypes,
          navigateToNextCell,
        }}
      />
    </>
  );
};

export default ExperimentTable;
