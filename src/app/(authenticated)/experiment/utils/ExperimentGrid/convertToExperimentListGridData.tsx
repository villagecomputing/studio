import { formatDate } from '@/lib/utils';
import { GridOptions } from 'ag-grid-community';
import { ExperimentList, ExperimentListRowType } from '../../types';

function getExperimentListTableColumnDefs(): GridOptions<ExperimentListRowType>['columnDefs'] {
  return [
    {
      headerName: 'Id',
      field: 'id',
      width: 100,
    },
    {
      headerName: 'Experiment Name',
      field: 'experimentName',
      width: 200,
    },
    {
      headerName: 'Grouping ID',
      field: 'groupId',
      width: 150,
    },
    {
      headerName: 'Dataset',
      field: 'datasetName',
      width: 150,
    },
    {
      headerName: 'Runtime',
      field: 'runtime',
      width: 90,
    },
    {
      headerName: 'Date',
      field: 'date',
      width: 150,
    },
    {
      headerName: 'Avg. Cost',
      field: 'avgCost',
      width: 100,
    },
    {
      headerName: 'Latency',
      field: 'avgLatency',
      width: 90,
    },
    {
      headerName: 'Accuracy',
      field: 'avgAccuracy',
      width: 100,
    },
    {
      headerName: 'Parameters',
      field: 'params',
      width: 300,
    },
  ];
}

function getExperimentListRowData(
  data: ExperimentList,
): ExperimentListRowType[] {
  return data.map((data) => ({
    id: data.id,
    experimentName: data.name,
    groupId: data.groupId,
    date: formatDate(data.created_at),
    datasetName: data.Dataset.name,
    avgAccuracy: '79.36%',
    avgCost: '$ 0.0034',
    avgLatency: '1.82s',
    runtime: '5m 32s',
    params: data.pipelineMetadata,
  }));
}

export function convertToExperimentListGridData(data: ExperimentList) {
  return {
    columnDefs: getExperimentListTableColumnDefs(),
    rowData: getExperimentListRowData(data),
  };
}
