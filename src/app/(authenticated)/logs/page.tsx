'use client';
import Breadcrumb from '@/components/Breadcrumb';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { CellClickedEvent } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import DataTable from '../components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '../components/data-table/constants';
import { SearchInput } from '../components/search-input/SearchInput';
import { useLogsListContext } from './components/LogsListProvider';
import LogsListZeroState from './components/zero-state/LogsListZeroState';
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

  const searchInLogsList: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuickFilterText(event.target.value);
  };
  const logsMetadataColumnsPercentiles = useMemo(() => {
    return getLogsMetadataColumnsPercentiles(logs);
  }, [logs]);

  return (
    <>
      <div className={cn(['flex items-center justify-between gap-2 px-6'])}>
        <Breadcrumb />
        <UserButton />
      </div>
      <div className="px-6">
        <div className={'my-6 flex items-center justify-between gap-5'}>
          <SearchInput onChange={searchInLogsList} />
        </div>
        {!logs.length ? (
          <LogsListZeroState />
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
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LogsPage;
