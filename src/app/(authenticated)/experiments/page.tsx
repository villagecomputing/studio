'use client';
import Breadcrumb from '@/components/Breadcrumb';
import { cn } from '@/lib/utils';
import { GridOptions } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, useEffect, useState } from 'react';
import DataTable from '../components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '../components/data-table/constants';
import { SearchInput } from '../components/search-input/SearchInput';
import { RowType } from './types';

const getData = async () => {
  return [];
};

const ExperimentsPage = () => {
  const router = useRouter();
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const [experimentsList, setExperimentsList] = useState([]);

  const rowData: RowType[] = [];
  const colDef: GridOptions['columnDefs'] = [];

  useEffect(() => {
    (async () => {
      setExperimentsList(await getData());
    })();
  }, []);

  const searchInExperimentList: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setQuickFilterText(event.target.value);
  };

  return (
    <>
      <div className={cn(['px-6'])}>
        <Breadcrumb />
      </div>
      <div className="px-6">
        <div className={'my-6 flex items-center justify-between gap-5'}>
          <SearchInput onChange={searchInExperimentList} />
        </div>
        {!experimentsList.length ? (
          <span>No Experiments :(</span>
        ) : (
          <div
            className="overflow-y-auto"
            style={{ height: 'calc(100vh - 150px)' }}
          >
            <DataTable<RowType>
              theme="ag-theme-dataset-list"
              agGridProps={{
                ...DEFAULT_GRID_OPTIONS,
                onRowClicked: (event) => {
                  if (!event.data) {
                    return;
                  }
                  router.push(`/experiments/${event.data.id}`);
                },
                rowData,
                columnDefs: colDef,
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

export default ExperimentsPage;
