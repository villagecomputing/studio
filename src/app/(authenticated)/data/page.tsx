'use client';
import { datasetListResponseSchema } from '@/app/api/dataset/list/schema';
import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import { formatDate } from '@/lib/utils';
import { GridOptions } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DataTable from '../components/data-table/DataTable';
import { SearchInput } from '../components/search-input/SearchInput';
import UploadDataButton from './components/upload-data-button/UploadDataButton';
import { UploadDataProvider } from './components/upload-data-dialog/UploadDataProvider';
import ZeroState from './components/zero-state/ZeroState';

const getData = async () => {
  const response = await fetch(ApiEndpoints.datasetList, {
    method: 'GET',
  });
  const datasetList = JSON.parse(await response.json());
  return datasetListResponseSchema.parse(datasetList);
};

type DatasetList = ResultSchemaType[ApiEndpoints.datasetList];

const DataPage = () => {
  const router = useRouter();
  const [datasetList, setDatasetList] = useState<DatasetList>([]);

  const rowData = datasetList.map((data) => ({
    datasetName: data.file_name,
    numberOfRecords: data.total_rows,
    uploadDate: formatDate(data.created_at),
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

  useEffect(() => {
    (async () => {
      setDatasetList(await getData());
    })();
  }, []);

  const refetchData = async () => {
    setDatasetList(await getData());
  };

  return (
    <div className="px-6">
      <UploadDataProvider refetchData={refetchData}>
        <div className={'my-6 flex items-center justify-between gap-5'}>
          <SearchInput />
          <UploadDataButton />
        </div>
        {!datasetList.length ? (
          <ZeroState />
        ) : (
          <DataTable
            theme="ag-theme-dataset-list"
            agGridProps={{
              onRowClicked: () => {
                router.push(`/data/dataset_1`);
              },
              rowData,
              columnDefs: colDef,
              domLayout: 'autoHeight',
              rowSelection: 'single',
            }}
          />
        )}
      </UploadDataProvider>
    </div>
  );
};

export default DataPage;
