import { formatDate } from '@/lib/utils';
import { CellClickedEvent, GridOptions } from 'ag-grid-community';
import DatasetNameCellRenderer from '../../components/DatasetNameCellRenderer';
import GroupIdCellRenderer from '../../components/GroupIdCellRenderer';
import ParametersCellRenderer from '../../components/ParametersCellRenderer';
import { ExperimentList, ExperimentListRowType } from '../../types';

function getExperimentListTableColumnDefs(
  onCellClicked: (event: CellClickedEvent) => void,
): GridOptions<ExperimentListRowType>['columnDefs'] {
  return [
    {
      headerName: 'Id',
      field: 'id',
      width: 100,
      onCellClicked,
    },
    {
      headerName: 'Experiment Name',
      field: 'experimentName',
      width: 200,
      onCellClicked,
    },
    {
      headerName: 'Grouping ID',
      field: 'groupId',
      width: 150,
      cellRenderer: GroupIdCellRenderer,
    },
    {
      headerName: 'Dataset',
      field: 'dataset',
      width: 150,
      cellRenderer: DatasetNameCellRenderer,
      valueFormatter: (params) => params.data?.dataset.name || '',
      valueGetter: (params) => params.data?.dataset.id,
    },
    {
      headerName: 'Runtime',
      field: 'runtime',
      width: 90,
      onCellClicked,
    },
    {
      headerName: 'Date',
      field: 'date',
      width: 150,
      onCellClicked,
    },
    {
      headerName: 'Avg. Cost',
      field: 'avgCost',
      width: 100,
      onCellClicked,
    },
    {
      headerName: 'Latency',
      field: 'avgLatency',
      width: 90,
      onCellClicked,
    },
    {
      headerName: 'Accuracy',
      field: 'avgAccuracy',
      width: 100,
      onCellClicked,
    },
    {
      headerName: 'Parameters',
      field: 'params',
      flex: 1,
      minWidth: 350,
      onCellClicked,
      cellRenderer: ParametersCellRenderer,
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
    dataset: { id: data.Dataset.id, name: data.Dataset.name },
    avgAccuracy: '79.36%',
    avgCost: '$ 0.0034',
    avgLatency: '1.82s',
    runtime: '5m 32s',
    params: data.pipelineMetadata,
  }));
}

export function convertToExperimentListGridData(
  data: ExperimentList,
  onCellClicked: (event: CellClickedEvent) => void,
) {
  return {
    columnDefs: getExperimentListTableColumnDefs(onCellClicked),
    rowData: getExperimentListRowData(data),
  };
}
