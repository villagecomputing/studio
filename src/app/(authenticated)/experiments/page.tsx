'use client';
import { experimentListResponseSchema } from '@/app/api/experiment/list/schema';
import Breadcrumb from '@/components/Breadcrumb';
import { ApiEndpoints } from '@/lib/routes/routes';
import { cn, formatDate } from '@/lib/utils';
import { GridOptions } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, useEffect, useState } from 'react';
import DataTable from '../components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '../components/data-table/constants';
import { SearchInput } from '../components/search-input/SearchInput';
import { ExperimentList, ExperimentRowType } from './types';

const getData = async (): Promise<ExperimentList> => {
  const response = await fetch(ApiEndpoints.experimentList, {
    method: 'GET',
  });
  const experimentList = JSON.parse(await response.json());
  return experimentListResponseSchema.parse(experimentList);
};

const ExperimentsPage = () => {
  const router = useRouter();
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const [experimentsList, setExperimentsList] = useState<ExperimentList>([]);

  const rowData: ExperimentRowType[] = experimentsList.map((data) => ({
    uuid: data.uuid,
    experimentName: data.name,
    date: formatDate(data.created_at),
    datasetName: data.Dataset_list.name,
  }));
  const colDef: GridOptions['columnDefs'] = [
    {
      headerName: 'Id',
      field: 'uuid',
      flex: 2,
      minWidth: 100,
    },
    {
      headerName: 'Dataset',
      field: 'datasetName',
      flex: 2,
      minWidth: 200,
    },
    {
      headerName: 'Experiment Name',
      field: 'experimentName',
      flex: 2,
      minWidth: 200,
    },
    {
      headerName: 'Date',
      field: 'date',
      flex: 2,
      minWidth: 90,
    },
  ];

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
            <DataTable<ExperimentRowType>
              theme="ag-theme-dataset-list"
              agGridProps={{
                ...DEFAULT_GRID_OPTIONS,
                onRowClicked: (event) => {
                  if (!event.data) {
                    return;
                  }
                  router.push(`/experiments/${event.data.uuid}`);
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
