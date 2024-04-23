'use client';
import Breadcrumb from '@/components/Breadcrumb';
import { CellClickedEvent } from 'ag-grid-community';
import Link from 'next/link';
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

import Loading from '@/components/loading/Loading';
import { useExperimentListContext } from './components/ExperimentListProvider';
import ExperimentListZeroState from './components/zero-state/ExperimentListZeroState';
import { ExperimentListRowType } from './types';
import ExperimentGrid from './utils/ExperimentGrid';
import { getExperimentsMetadataColumnsPercentiles } from './utils/utils';

const ExperimentsPage = () => {
  const router = useRouter();
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const { experiments, isLoading } = useExperimentListContext();
  const onCellClicked = useCallback((event: CellClickedEvent) => {
    if (!event.data) {
      return;
    }
    router.push(`/experiment/${event.data.id}`);
  }, []);

  const { columnDefs, rowData } =
    ExperimentGrid.convertToExperimentListGridData(experiments, onCellClicked);

  const experimentsMetadataColumnsPercentiles = useMemo(() => {
    return getExperimentsMetadataColumnsPercentiles(experiments);
  }, [experiments]);

  return (
    <>
      <PageHeader>
        <Breadcrumb
          customSegments={{
            experiment: <Link href={`/experiment`}>Experiments</Link>,
          }}
        />
      </PageHeader>
      <div className="px-6">
        <div className={'my-6 flex items-center justify-between gap-5'}>
          <SearchInput onChange={setQuickFilterText} value={quickFilterText} />
        </div>
        {isLoading && <Loading />}
        {!isLoading && !experiments.length && (
          <ExperimentListZeroState text="No experiments added" />
        )}
        {!isLoading && !!experiments.length && (
          <div
            className="overflow-y-auto"
            style={{ height: 'calc(100vh - 150px)' }}
          >
            <DataTable<ExperimentListRowType>
              theme="ag-theme-experiment-list"
              agGridProps={{
                ...DEFAULT_GRID_OPTIONS,
                context: experimentsMetadataColumnsPercentiles,
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

export default ExperimentsPage;
