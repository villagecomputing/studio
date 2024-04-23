'use client';
import { datasetListResponseSchema } from '@/app/api/dataset/list/schema';
import Breadcrumb from '@/components/Breadcrumb';
import Loading from '@/components/loading/Loading';
import { ApiEndpoints } from '@/lib/routes/routes';
import {
  UUIDPrefixEnum,
  createFakeId,
  formatDate,
  getUuidFromFakeId,
} from '@/lib/utils';
import { CellClickedEvent, GridOptions } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import { onFilterChanged } from '../common/gridUtils';
import DataTable from '../components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '../components/data-table/constants';
import {
  CustomNoRowsOverlay,
  CustomNoRowsOverlayParams,
} from '../components/no-rows-overlay/NoRowsOverlay';
import PageHeader from '../components/page-header/PageHeader';
import { SearchInput } from '../components/search-input/SearchInput';
import FakeIdCellRenderer from './[datasetId]/components/FakeIdCellRenderer';
import UploadDataButton from './components/upload-data-button/UploadDataButton';
import { UploadDataProvider } from './components/upload-data-dialog/UploadDataProvider';
import ZeroState from './components/zero-state/ZeroState';

const getData = async () => {
  const response = await fetch(ApiEndpoints.datasetList, {
    method: 'GET',
  });
  const datasetList = await response.json();
  return datasetListResponseSchema.parse(datasetList).map((dataset) => {
    return {
      ...dataset,
      id: getUuidFromFakeId(dataset.id, UUIDPrefixEnum.DATASET),
    };
  });
};

type RowType = {
  id: string;
  fakeId: string;
  datasetName: string;
  numberOfRecords: string;
  uploadDate: string;
};
const DataPage = () => {
  const router = useRouter();
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const {
    data: datasetList = [],
    mutate,
    isLoading,
  } = useSWR('datasetList', getData);
  const rowData: RowType[] = datasetList?.map((data) => ({
    id: data.id,
    fakeId: createFakeId(data.name, data.id),
    datasetName: data.name,
    numberOfRecords: data.total_rows,
    uploadDate: formatDate(data.created_at),
  }));
  const onCellClicked = (event: CellClickedEvent<RowType, string>) => {
    if (!event.data) {
      return;
    }
    router.push(`/data/${event.data.id}`);
  };
  const colDef: GridOptions['columnDefs'] = [
    {
      headerName: 'ID',
      // The 'fakeId' field is also referenced in the ag-grid-custom-theme. Any changes here should be reflected there.
      field: 'fakeId',
      cellRenderer: FakeIdCellRenderer,
      maxWidth: 50,
      tooltipValueGetter: (props) => `Copy ID to clipboard: ${props.value}`,
    },
    {
      headerName: 'Dataset Name',
      field: 'datasetName',
      flex: 5,
      minWidth: 200,
      onCellClicked,
    },
    {
      headerName: 'Rows',
      field: 'numberOfRecords',
      flex: 1,
      minWidth: 90,
      onCellClicked,
    },
    {
      headerName: 'Upload Date',
      field: 'uploadDate',
      flex: 1,
      minWidth: 200,
      onCellClicked,
    },
  ];

  return (
    <>
      <PageHeader>
        <Breadcrumb />
      </PageHeader>
      <div className="px-6">
        <UploadDataProvider
          refetchData={async () => {
            mutate();
          }}
        >
          <div className={'my-6 flex items-center justify-between gap-5'}>
            <SearchInput
              onChange={setQuickFilterText}
              value={quickFilterText}
            />
            <UploadDataButton />
          </div>
          {isLoading && <Loading />}
          {!isLoading && !datasetList.length && <ZeroState />}
          {!isLoading && !!datasetList.length && (
            <div
              className="overflow-y-auto"
              style={{ height: 'calc(100vh - 150px)' }}
            >
              <DataTable<RowType>
                theme="ag-theme-dataset-list"
                agGridProps={{
                  ...DEFAULT_GRID_OPTIONS,
                  rowData,
                  columnDefs: colDef,
                  domLayout: 'autoHeight',
                  quickFilterText,
                  rowSelection: undefined,
                  tooltipShowDelay: 100,
                  tooltipHideDelay: 2000,
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
        </UploadDataProvider>
      </div>
    </>
  );
};

export default DataPage;
