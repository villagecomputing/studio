import { formatDate } from '@/lib/utils';
import { GridOptions } from 'ag-grid-community';
import DataTable from '../components/data-table/DataTable';
import { SearchInput } from '../components/search-input/SearchInput';
import UploadDataButton from './components/upload-data-button/UploadDataButton';
import ZeroState from './components/zero-state/ZeroState';

const DataPage = async () => {
  const mockData = [
    {
      id: 1,
      datasetName: 'dataset_1',
      numberOfRecords: 100,
      uploadDate: '2021-10-10',
    },
    {
      id: 2,
      datasetName: 'dataset_2',
      numberOfRecords: 200,
      uploadDate: '2021-10-11',
    },
    {
      id: 3,
      datasetName: 'dataset_3',
      numberOfRecords: 300,
      uploadDate: '2021-10-12',
    },
    {
      id: 4,
      datasetName: 'dataset_4',
      numberOfRecords: 400,
      uploadDate: '2021-10-13',
    },
    {
      id: 5,
      datasetName: 'dataset_5',
      numberOfRecords: 500,
      uploadDate: '2021-10-14',
    },
    {
      id: 6,
      datasetName: 'dataset_6',
      numberOfRecords: 600,
      uploadDate: '2021-10-15',
    },
    {
      id: 7,
      datasetName: 'dataset_7',
      numberOfRecords: 700,
      uploadDate: '2021-10-16',
    },
    {
      id: 8,
      datasetName: 'dataset_8',
      numberOfRecords: 800,
      uploadDate: '2021-10-17',
    },
    {
      id: 9,
      datasetName: 'dataset_9',
      numberOfRecords: 900,
      uploadDate: '2021-10-18',
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

  return (
    <div className="px-6">
      <div className={'my-6 flex items-center justify-between gap-5'}>
        <SearchInput />
        <UploadDataButton />
      </div>
      {!mockData.length ? (
        <ZeroState />
      ) : (
        <DataTable
          theme="ag-theme-dataset-list"
          agGridProps={{
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
