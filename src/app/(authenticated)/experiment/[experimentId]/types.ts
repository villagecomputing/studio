import { Enum_Experiment_Column_Type } from '@/lib/types';
import { ColDef } from 'ag-grid-community';

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
  columns: ExperimentTableColumnProps[];
  rows: ExperimentRow[];
};

export type ExperimentRow = {
  [k: string]: string;
};

export type FetchExperimentResult = AGGridExperiment & {
  experimentName: string;
};
