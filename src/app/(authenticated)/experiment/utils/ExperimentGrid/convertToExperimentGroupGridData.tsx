import { formatDate } from '@/lib/utils';
import { ColDef } from 'ag-grid-community';
import { ExperimentGroupRowType } from '../../../group/[groupId]/types';
import { ExperimentList } from '../../types';

function getDefaultTableColumnDefs(): ColDef<ExperimentGroupRowType>[] {
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
      avgAccuracy: '79.36%',
      avgCost: '$ 0.0034',
      avgLatency: '1.82s',
      runtime: '5m 32s',
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
