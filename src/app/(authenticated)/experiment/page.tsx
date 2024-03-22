'use client';
import Breadcrumb from '@/components/Breadcrumb';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, useState } from 'react';
import DataTable from '../components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '../components/data-table/constants';
import { SearchInput } from '../components/search-input/SearchInput';
import { useExperimentListContext } from './components/ExperimentListProvider';
import ExperimentListZeroState from './components/zero-state/ExperimentListZeroState';
import { ExperimentListRowType } from './types';
import ExperimentGrid from './utils/ExperimentGrid';

const ExperimentsPage = () => {
  const router = useRouter();
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const { experiments } = useExperimentListContext();
  const { columnDefs, rowData } =
    ExperimentGrid.convertToExperimentListGridData(experiments);

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
        {!experiments.length ? (
          <ExperimentListZeroState />
        ) : (
          <div
            className="overflow-y-auto"
            style={{ height: 'calc(100vh - 150px)' }}
          >
            <DataTable<ExperimentListRowType>
              theme="ag-theme-dataset-list"
              agGridProps={{
                ...DEFAULT_GRID_OPTIONS,
                onRowClicked: (event) => {
                  if (!event.data) {
                    return;
                  }
                  router.push(`/experiment/${event.data.id}`);
                },
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

export default ExperimentsPage;
