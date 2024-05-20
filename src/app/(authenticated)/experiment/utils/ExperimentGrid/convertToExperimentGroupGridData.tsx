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
      type: Enum_Metadata_Type.RUNTIME,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Date',
      field: 'date',
    },
    {
      headerName: 'Avg. Cost',
      field: 'avgCost',
      type: Enum_Metadata_Type.COST,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Latency P90',
      field: 'p90Latency',
      type: Enum_Metadata_Type.LATENCY90,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Latency P50',
      field: 'p50Latency',
      type: Enum_Metadata_Type.LATENCY50,
      cellRenderer: MetadataColumnCellRenderer,
    },
    {
      headerName: 'Accuracy',
      field: 'avgAccuracy',
      type: Enum_Metadata_Type.ACCURACY,
      cellRenderer: MetadataColumnCellRenderer,
    },
  ];
}

function getDynamicTableColumnDefs(data: ExperimentList): ColDef[] {
  if (data.length === 0) {
    return [];
  }

  // Determine which step_key combinations have different values across experiments
  const uniqueStepKeys = new Set<string>();
  const stepKeyValues = new Map<string, Set<string>>();

  for (const experimentData of data) {
    const metadata = JSON.parse(experimentData.pipelineMetadata);
    for (const [step, details] of Object.entries(metadata)) {
      if (!details) {
        continue;
      }
      for (const [key, value] of Object.entries(
        details as Record<string, string>,
      )) {
        const stepKey = `${step}_${key}`;
        if (!stepKeyValues.has(stepKey)) {
          stepKeyValues.set(stepKey, new Set<string>());
        }
        stepKeyValues.get(stepKey)!.add(value);
      }
    }
  }

  // Only keep step_keys that have more than one unique value
  stepKeyValues.forEach((values, stepKey) => {
    if (values.size > 1) {
      uniqueStepKeys.add(stepKey);
    }
  });

  // Create column definitions only for those unique step_keys
  return Array.from(uniqueStepKeys).map((stepKey) => ({
    headerName: stepKey,
    field: stepKey,
  }));
}

function getExperimentGroupRowData(data: ExperimentList) {
  return data.map((experimentData): ExperimentGroupRowType => {
    const metadata = JSON.parse(experimentData.pipelineMetadata);
    const dynamicData: Record<string, string> = {};

    for (const [step, details] of Object.entries(metadata)) {
      if (!details) {
        continue;
      }
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
      avgAccuracy: experimentData.avgAccuracy,
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
    ].map((colDef) => {
      return { ...colDef, flex: 1 };
    }) as ColDef[],
    rowData: getExperimentGroupRowData(data),
  };
}
