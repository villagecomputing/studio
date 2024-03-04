'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { SearchInput } from '@/app/(authenticated)/components/search-input/SearchInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { AGGridDataset } from '../types';
import {
  getRowId,
  getTableColumnTypes,
  getTableDataTypeDefinitions,
  onTableCellValueChanged,
} from '../utils';
import DatasetRowInspectorView from './DatasetRowInspector/DatasetRowInspectorView';
import { useDatasetTableContext } from './DatasetTableContext';

export default function DataSetTable(props: AGGridDataset) {
  const { pinnedBottomRowData } = props;
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const context = useDatasetTableContext(props);

  const searchInDatasetList: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuickFilterText(event.target.value);
  };

  return (
    <>
      <div className={cn(['flex items-center justify-between p-6'])}>
        <SearchInput onChange={searchInDatasetList} />
        <Button variant={'outline'}>Download</Button>
      </div>
      <DatasetRowInspectorView context={context} />
      <DataTable
        theme="ag-theme-dataset"
        agGridProps={{
          getRowId: useCallback(getRowId, []),
          rowData: context.rows,
          columnDefs: context.columnDefs,
          context,
          pinnedBottomRowData,
          columnTypes: getTableColumnTypes(),
          dataTypeDefinitions: getTableDataTypeDefinitions(),
          reactiveCustomComponents: true,
          quickFilterText,
          onCellValueChanged: onTableCellValueChanged,
          enableCellTextSelection: true,
        }}
      />
    </>
  );
}
