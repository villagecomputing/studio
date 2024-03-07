'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { SearchInput } from '@/app/(authenticated)/components/search-input/SearchInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';

import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AGGridDataset, DatasetRow } from '../types';
import {
  getRowId,
  getTableColumnTypes,
  getTableDataTypeDefinitions,
  navigateToNextCell,
  onTableCellValueChanged,
} from '../utils';
import DatasetRowInspectorView from './DatasetRowInspector/DatasetRowInspectorView';
import { useDatasetTableContext } from './DatasetTableContext';

export default function DataSetTable(props: AGGridDataset) {
  const gridRef = useRef<AgGridReactType<DatasetRow>>(null);
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const context = useDatasetTableContext(props);

  const searchInDatasetList: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuickFilterText(event.target.value);
  };

  useEffect(() => {
    if (!gridRef.current) {
      return;
    }
    context.gridRef.current = gridRef.current;
  }, [gridRef, context.gridRef]);

  return (
    <>
      <div className={cn(['flex items-center justify-between p-6'])}>
        <SearchInput onChange={searchInDatasetList} />
        <Button variant={'outline'}>Download</Button>
      </div>
      <DatasetRowInspectorView context={context} />
      <DataTable<DatasetRow>
        theme="ag-theme-dataset"
        gridRef={gridRef}
        className={
          context.inspectorRowIndex !== null ? 'small-dataset-table-view' : ''
        }
        agGridProps={{
          getRowId: useCallback(getRowId, []),
          context,
          rowData: context.rows,
          columnDefs: context.columnDefs,
          pinnedBottomRowData: context.pinnedBottomRow,
          columnTypes: getTableColumnTypes(),
          dataTypeDefinitions: getTableDataTypeDefinitions(),
          reactiveCustomComponents: true,
          quickFilterText,
          onCellValueChanged: onTableCellValueChanged,
          enableCellTextSelection: true,
          rowSelection: 'single',
          navigateToNextCell: useCallback(navigateToNextCell, []),
        }}
      />
    </>
  );
}
