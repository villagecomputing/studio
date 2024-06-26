import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';

export type ExperimentList = ResultSchemaType[ApiEndpoints.experimentList];

export type ExperimentListRowType = {
  name: string;
  description: string;
  groupId: string;
  groupName: string | null;
  dataset: { id: string; name: string };
  runtime: number;
  date: string;
  avgCost: number;
  avgAccuracy: number;
  p50Latency: number;
  p90Latency: number;
  params: string;
};

export interface ExperimentListContextType {
  experiments: ExperimentList;
  isLoading: boolean;
}
