import { formatDate } from '@/lib/utils';
import { CellClickedEvent, GridOptions } from 'ag-grid-community';
import { Enum_Metadata_Type } from '../../[logsId]/components/MetadataElement';
import MetadataColumnCellRenderer from '../../components/MetadataColumnCellRenderer';
import ParametersCellRenderer from '../../components/ParametersCellRenderer';
import { LogsList, LogsListRowType } from '../../types';

function getLogsListTableColumnDefs(
  onCellClicked: (event: CellClickedEvent) => void,
): GridOptions<LogsListRowType>['columnDefs'] {
  return [
    {
      headerName: 'Name',
      field: 'name',
      minWidth: 150,
      flex: 3,
      onCellClicked,
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

function getLogsListRowData(data: LogsList): LogsListRowType[] {
  return data.map((data) => ({
    id: data.id,
    name: data.name || '-',
    date: formatDate(data.createdAt),
    avgAccuracy: data.avgAccuracy,
    avgCost: data.totalCost ? data.totalCost / data.totalRows : 0,
    p50Latency: data.latencyP50,
    p90Latency: data.latencyP90,
    runtime: data.runtime,
    params: data.pipelineMetadata,
  }));
}

export function convertToLogsListGridData(
  data: LogsList,
  onCellClicked: (event: CellClickedEvent) => void,
) {
  return {
    columnDefs: getLogsListTableColumnDefs(onCellClicked),
    rowData: getLogsListRowData(data),
  };
}
