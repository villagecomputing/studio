import { Enum_Experiment_Column_Type } from '@/lib/types';
import { ColDef } from 'ag-grid-community';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import {
  AGGridDataset,
  DatasetTableColumnProps,
  GroundTruthCell,
} from '../../data/[datasetId]/types';

export type ExperimentViewPageProps = {
  params: {
    experimentId: string;
  };
};

export type AGGridExperiment = {
  experimentId: string;
  columnDefs: ColDef[];
  rowData: ExperimentRow[];
};

export type ExperimentTableColumnProps = {
  id: number;
  name: string;
  field: string;
  type: Enum_Experiment_Column_Type;
};

export type ConvertToAGGridDataProps = {
  experimentId: string;
  columns: (ExperimentTableColumnProps | DatasetTableColumnProps)[];
  rows: ExperimentRow[];
};

export type ExperimentRow = {
  [k: string]: string | GroundTruthCell;
};

export type FetchExperimentResult = AGGridExperiment & {
  experimentName: string;
  dataset: {
    name: string;
    id: string;
  };
  latencyP50: number;
  latencyP90: number;
  runtime: number;
  cost: number;
  accuracy: number;
  parameters: string;
  costP25: number;
  costP75: number;
  latencyP25: number;
  latencyP75: number;
};

export type ExperimentTableContext = {
  costP25: number;
  costP75: number;
  latencyP25: number;
  latencyP75: number;
  stepMetadataColumns: { name: string; field: string }[];
  inspectorRowIndex: number | null;
  setInspectorRowIndex: Dispatch<SetStateAction<number | null>>;
  rows: AGGridDataset['rowData'];
  columnDefs: AGGridDataset['columnDefs'];
  gridRef: MutableRefObject<AgGridReactType<ExperimentRow> | undefined>;
};
