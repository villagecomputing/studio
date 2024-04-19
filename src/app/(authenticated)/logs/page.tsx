'use client';
import Breadcrumb from '@/components/Breadcrumb';
import { CellClickedEvent } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { onFilterChanged } from '../common/gridUtils';
import DataTable from '../components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '../components/data-table/constants';
import {
  CustomNoRowsOverlay,
  CustomNoRowsOverlayParams,
} from '../components/no-rows-overlay/NoRowsOverlay';
import PageHeader from '../components/page-header/PageHeader';
import { SearchInput } from '../components/search-input/SearchInput';
import ExperimentListZeroState from '../experiment/components/zero-state/ExperimentListZeroState';
import { useLogsListContext } from './components/LogsListProvider';
import { LogsListRowType } from './types';
import LogsGrid from './utils/LogsGrid';
import { getLogsMetadataColumnsPercentiles } from './utils/utils';

const LogsPage = () => {
  const router = useRouter();
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const { logs } = useLogsListContext();
  const onCellClicked = useCallback((event: CellClickedEvent) => {
    if (!event.data) {
      return;
    }
    router.push(`/logs/${event.data.id}`);
  }, []);

  const { columnDefs, rowData } = LogsGrid.convertToLogsListGridData(
    logs,
    onCellClicked,
  );

  const logsMetadataColumnsPercentiles = useMemo(() => {
    return getLogsMetadataColumnsPercentiles(logs);
  }, [logs]);

  return (
    <>
      <PageHeader>
        <Breadcrumb />
      </PageHeader>
      <div className="px-6">
        <div className={'my-6 flex items-center justify-between gap-5'}>
          <SearchInput onChange={setQuickFilterText} value={quickFilterText} />
        </div>
        {!logs.length ? (
          <ExperimentListZeroState text="No logs added" />
        ) : (
          <div
            className="overflow-y-auto"
            style={{ height: 'calc(100vh - 150px)' }}
          >
            <DataTable<LogsListRowType>
              theme="ag-theme-experiment-list"
              agGridProps={{
                ...DEFAULT_GRID_OPTIONS,
                context: logsMetadataColumnsPercentiles,
                rowData,
                columnDefs,
                domLayout: 'autoHeight',
                quickFilterText,
                onFilterChanged: onFilterChanged,
                noRowsOverlayComponent: CustomNoRowsOverlay,
                noRowsOverlayComponentParams: {
                  resetFilter: () => {
                    setQuickFilterText('');
                  },
                  isFilterPresent: quickFilterText !== '',
                  text: 'No results matching your search',
                } as CustomNoRowsOverlayParams,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LogsPage;
