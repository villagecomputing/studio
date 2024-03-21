import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import { ColDef } from 'ag-grid-community';

export type ExperimentList = ResultSchemaType[ApiEndpoints.experimentList];
export type ExperimentRowType = {
  id: string;
  experimentName: string;
  date: string;
  datasetName: string;
};

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
  // TODO Change this to Enum type
  type: string;
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
