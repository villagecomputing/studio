import { formatDate } from '@/lib/utils';
import { ColDef } from 'ag-grid-community';
import { ExperimentGroupRowType } from '../../../group/[groupId]/types';
import { Enum_Metadata_Type } from '../../[experimentId]/components/MetadataElement';
import MetadataColumnCellRenderer from '../../components/MetadataColumnCellRenderer';
import { ExperimentList } from '../../types';

function getDefaultTableColumnDefs(): ColDef<ExperimentGroupRowType>[] {
  return [
    {
      headerName: 'Runtime',
      field: 'runtime',
      width: 90,
      type: Enum_Metadata_Type.RUNTIME,
      cellRenderer: MetadataColumnCellRenderer,
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
      type: Enum_Metadata_Type.COST,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Latency P90',
      field: 'p90Latency',
      width: 90,
      type: Enum_Metadata_Type.LATENCY,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Latency P50',
      field: 'p50Latency',
      width: 90,
      type: Enum_Metadata_Type.LATENCY,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Accuracy',
      field: 'avgAccuracy',
      width: 100,
      type: Enum_Metadata_Type.ACCURACY,
      cellRenderer: MetadataColumnCellRenderer,
    },
  ];
}

function getDynamicTableColumnDefs(data: ExperimentList): ColDef[] {
  if (data.length === 0) {
    return [];
  }

  const firstExperimentMetadata = JSON.parse(data[0].pipelineMetadata);

  return Object.entries(firstExperimentMetadata).flatMap(([step, details]) => {
    return Object.keys(details as object).map((key) => ({
      headerName: `${step}_${key}`,
      field: `${step}_${key}`,
      width: 150,
    }));
  });
}

function getExperimentGroupRowData(data: ExperimentList) {
  return data.map((experimentData): ExperimentGroupRowType => {
    const metadata = JSON.parse(experimentData.pipelineMetadata);
    const dynamicData: Record<string, string> = {};

    for (const [step, details] of Object.entries(metadata)) {
      for (const [key, value] of Object.entries(
        details as Record<string, string>,
      )) {
        dynamicData[`${step}_${key}`] = value;
      }
    }

    return {
      id: experimentData.id,
      experimentName: experimentData.name,
      date: formatDate(experimentData.created_at),
      avgAccuracy: experimentData.totalAccuracy
        ? experimentData.totalAccuracy / experimentData.totalRows
        : 0,
      avgCost: experimentData.totalCost
        ? experimentData.totalCost / experimentData.totalRows
        : 0,
      p50Latency: experimentData.latencyP50,
      p90Latency: experimentData.latencyP90,
      runtime: experimentData.runtime,
      ...dynamicData,
    };
  });
}

export function convertToExperimentGroupGridData(data: ExperimentList) {
  return {
    columnDefs: [
      ...getDefaultTableColumnDefs(),
      ...getDynamicTableColumnDefs(data),
    ],
    rowData: getExperimentGroupRowData(data),
  };
}
