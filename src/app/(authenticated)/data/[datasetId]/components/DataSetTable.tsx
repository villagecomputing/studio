'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { SearchInput } from '@/app/(authenticated)/components/search-input/SearchInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';

import DatasetParser from '@/lib/services/DatasetParser';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useGridOperations } from '../hooks/useGridOperations';
import { DatasetRow, FetchDatasetResult } from '../types';

import { mapFieldNameToHeaderName } from '../utils/commonUtils';
import DatasetRowInspector from './DatasetRowInspector/DatasetRowInspector';
import { useDatasetTableContext } from './DatasetTableContext';

export default function DataSetTable(props: FetchDatasetResult) {
  const gridRef = useRef<AgGridReactType<DatasetRow>>(null);
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const context = useDatasetTableContext(props);
  const {
    getRowId,
    navigateToNextCell,
    onCellValueChanged,
    columnTypes,
    dataTypeDefinitions,
  } = useGridOperations();

  const searchInDatasetList: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuickFilterText(event.target.value);
  };

  useEffect(() => {
    if (!gridRef.current) {
      return;
    }
    context.gridRef.current = gridRef.current;
  }, [gridRef, context.gridRef]);

  const downloadCSV = () => {
    const parsedRows = context.rows.map((row) =>
      mapFieldNameToHeaderName(row, context.columnDefs),
    );
    const csv = DatasetParser.parseRowObjectsToCSVString(parsedRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${props.datasetName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className={cn(['flex items-center justify-between p-6'])}>
        <SearchInput onChange={searchInDatasetList} />
        <Button variant={'outline'} onClick={downloadCSV}>
          Download
        </Button>
      </div>
      <DatasetRowInspector context={context} />
      <DataTable<DatasetRow>
        theme="ag-theme-dataset"
        gridRef={gridRef}
        className={
          context.inspectorRowIndex !== null ? 'small-dataset-table-view' : ''
        }
        agGridProps={{
          getRowId,
          context,
          rowData: context.rows,
          columnDefs: context.columnDefs,
          pinnedBottomRowData: context.pinnedBottomRow,
          columnTypes,
          dataTypeDefinitions,
          reactiveCustomComponents: true,
          quickFilterText,
          onCellValueChanged,
          enableCellTextSelection: true,
          rowSelection: 'single',
          suppressCellFocus: true,
          stopEditingWhenCellsLoseFocus: true,
          navigateToNextCell,
        }}
      />
    </>
  );
}
