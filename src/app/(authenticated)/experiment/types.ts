import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';

export type ExperimentList = ResultSchemaType[ApiEndpoints.experimentList];

export type DatasetNameProps = {
  name: string;
  id: string;
};

export type ExperimentListRowType = {
  id: string;
  experimentName: string;
  groupId: number;
  dataset: { id: string; name: string };
  runtime: string;
  date: string;
  avgCost: string;
  avgLatency: string;
  avgAccuracy: string;
  params: string;
};

export interface ExperimentListContextType {
  experiments: ExperimentList;
}
