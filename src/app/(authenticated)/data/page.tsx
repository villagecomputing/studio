'use client';
import { formatDate } from '@/lib/utils';
import { GridOptions } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import DataTable from '../components/data-table/DataTable';
import { SearchInput } from '../components/search-input/SearchInput';
import UploadDataButton from './components/upload-data-button/UploadDataButton';
import { UploadDataProvider } from './components/upload-data-dialog/UploadDataProvider';
import ZeroState from './components/zero-state/ZeroState';

const DataPage = () => {
  const mockData = [
    {
      id: 1,
      datasetName: 'dataset_1',
      numberOfRecords: 100,
      uploadDate: '2021-10-10',
    },
    {
      id: 10,
      datasetName: 'dataset_10',
      numberOfRecords: 1000,
      uploadDate: '2024-02-16',
    },
  ];
  const rowData = mockData.map((data) => ({
    datasetName: data.datasetName,
    numberOfRecords: data.numberOfRecords,
    uploadDate: formatDate(data.uploadDate),
  }));
  const colDef: GridOptions['columnDefs'] = [
    {
      headerName: 'Dataset Name',
      field: 'datasetName',
      flex: 5,
      minWidth: 200,
    },
    {
      headerName: 'Rows',
      field: 'numberOfRecords',
      flex: 1,
      minWidth: 90,
    },
    {
      headerName: 'Upload Date',
      field: 'uploadDate',
      flex: 1,
      minWidth: 200,
    },
  ];

  const router = useRouter();

  return (
    <div className="px-6">
      <div className={'my-6 flex items-center justify-between gap-5'}>
        <SearchInput />
        <UploadDataProvider>
          <UploadDataButton />
        </UploadDataProvider>
      </div>
      {!mockData.length ? (
        <ZeroState />
      ) : (
        <DataTable
          theme="ag-theme-dataset-list"
          agGridProps={{
            onRowClicked: () => {
              router.push(`/data/dataset_1`);
            },
            rowData: rowData,
            columnDefs: colDef,
            domLayout: 'autoHeight',
            rowSelection: 'single',
          }}
        />
      )}
    </div>
  );
};

export default DataPage;
