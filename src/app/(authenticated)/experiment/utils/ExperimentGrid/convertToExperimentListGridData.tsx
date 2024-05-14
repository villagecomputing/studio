import { formatDate } from '@/lib/utils';
import { CellClickedEvent, GridOptions } from 'ag-grid-community';
import { Enum_Metadata_Type } from '../../[experimentId]/components/MetadataElement';
import DatasetNameCellRenderer from '../../components/DatasetNameCellRenderer';
import GroupIdCellRenderer from '../../components/GroupIdCellRenderer';
import MetadataColumnCellRenderer from '../../components/MetadataColumnCellRenderer';
import ParametersCellRenderer from '../../components/ParametersCellRenderer';
import { ExperimentList, ExperimentListRowType } from '../../types';

function getExperimentListTableColumnDefs(
  onCellClicked: (event: CellClickedEvent) => void,
): GridOptions<ExperimentListRowType>['columnDefs'] {
  return [
    {
      headerName: 'Name',
      field: 'name',
      minWidth: 150,
      flex: 2,
      onCellClicked,
    },
    {
      headerName: 'Description',
      field: 'description',
      minWidth: 150,
      flex: 3,
      onCellClicked,
    },
    {
      headerName: 'Grouping ID',
      field: 'groupId',
      minWidth: 120,
      flex: 2,
      cellRenderer: GroupIdCellRenderer,
    },
    {
      headerName: 'Dataset',
      field: 'dataset',
      minWidth: 120,
      flex: 2,
      cellRenderer: DatasetNameCellRenderer,
      valueFormatter: (params) => params.data?.dataset.name || '',
      valueGetter: (params) => params.data?.dataset.id,
    },
    {
      headerName: 'Runtime',
      field: 'runtime',
      minWidth: 100,
      flex: 1,
      onCellClicked,
      type: Enum_Metadata_Type.RUNTIME,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Date',
      field: 'date',
      minWidth: 130,
      flex: 1,
      onCellClicked,
    },
    {
      headerName: 'Avg. Cost',
      field: 'avgCost',
      minWidth: 100,
      flex: 1,
      onCellClicked,
      type: Enum_Metadata_Type.COST,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Latency P50',
      field: 'p50Latency',
      minWidth: 120,
      flex: 1,
      onCellClicked,
      type: Enum_Metadata_Type.LATENCY50,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Latency P90',
      field: 'p90Latency',
      minWidth: 120,
      flex: 1,
      onCellClicked,
      type: Enum_Metadata_Type.LATENCY90,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Accuracy',
      field: 'avgAccuracy',
      minWidth: 100,
      flex: 1,
      onCellClicked,
      type: Enum_Metadata_Type.ACCURACY,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Parameters',
      field: 'params',
      flex: 4,
      minWidth: 300,
      cellRenderer: ParametersCellRenderer,
    },
  ];
}

function getExperimentListRowData(
  data: ExperimentList,
): ExperimentListRowType[] {
  return data.map((data) => ({
    id: data.id,
    name: data.name ?? '',
    description: data.description || '-',
    groupId: data.groupId,
    date: formatDate(data.created_at),
    dataset: { id: data.Dataset.id, name: data.Dataset.name },
    avgAccuracy: data.avgAccuracy,
    avgCost: data.totalCost ? data.totalCost / data.totalRows : 0,
    p50Latency: data.latencyP50,
    p90Latency: data.latencyP90,
    runtime: data.runtime,
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
