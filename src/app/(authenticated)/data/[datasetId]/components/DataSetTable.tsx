'use client';
import DataTable from '@/app/(authenticated)/components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '@/app/(authenticated)/components/data-table/constants';
import { SearchInput } from '@/app/(authenticated)/components/search-input/SearchInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';

import DatasetParser from '@/lib/services/DatasetParser';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGridOperations } from '../hooks/useGridOperations';
import { DatasetRow, FetchDatasetResult } from '../types';

import {
  doesExternalFilterPass,
  isExternalFilterPresent,
  onFilterChanged,
} from '@/app/(authenticated)/common/gridUtils';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Enum_Dynamic_dataset_static_fields } from '@/lib/services/ApiUtils/dataset/utils';
import { IRowNode } from 'ag-grid-community';
import { DateRange } from 'react-day-picker';
import {
  CustomNoRowsOverlay,
  CustomNoRowsOverlayParams,
} from '../../../components/no-rows-overlay/NoRowsOverlay';
import { mapFieldNameToHeaderName } from '../../utils/commonUtils';
import DatasetRowInspector from './DatasetRowInspector/DatasetRowInspector';
import { useDatasetTableContext } from './DatasetTableContext';

export type DataSetTableProps = FetchDatasetResult;

export default function DataSetTable(props: DataSetTableProps) {
  const gridRef = useRef<AgGridReactType<DatasetRow>>(null);
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const context = useDatasetTableContext(props);
  const {
    getRowId,
    navigateToNextCell,
    onCellValueChanged,
    columnTypes,
    dataTypeDefinitions,
  } = useGridOperations();

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
        <div className={cn(['flex w-full flex-row gap-4'])}>
          <DatePickerWithRange
            selectedDateRange={dateRange}
            setDateRange={setDateRange}
          />
          <SearchInput onChange={setQuickFilterText} value={quickFilterText} />
        </div>
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
          ...DEFAULT_GRID_OPTIONS,
          getRowId,
          context,
          rowData: context.rows,
          columnDefs: context.columnDefs,
          pinnedBottomRowData: context.pinnedBottomRow,
          columnTypes,
          dataTypeDefinitions,
          quickFilterText,
          onCellValueChanged,
          navigateToNextCell,
          onFilterChanged: onFilterChanged,
          noRowsOverlayComponent: CustomNoRowsOverlay,
          noRowsOverlayComponentParams: {
            resetFilter: () => {
              setQuickFilterText('');
              setDateRange(undefined);
            },
            isFilterPresent:
              quickFilterText !== '' || isExternalFilterPresent(dateRange),
            text: 'No records found. Adjust your filters or reset them to view more results.',
          } as CustomNoRowsOverlayParams,
          isExternalFilterPresent: useCallback(
            () => isExternalFilterPresent(dateRange),
            [dateRange, isExternalFilterPresent],
          ),
          doesExternalFilterPass: useCallback(
            (node: IRowNode<DatasetRow>) => {
              if (
                !node.data ||
                !node.data[Enum_Dynamic_dataset_static_fields.CREATED_AT]
              ) {
                return true;
              }
              return doesExternalFilterPass(
                node.data[
                  Enum_Dynamic_dataset_static_fields.CREATED_AT
                ].toString(),
                dateRange,
              );
            },
            [dateRange, doesExternalFilterPass],
          ),
        }}
      />
    </>
  );
}
