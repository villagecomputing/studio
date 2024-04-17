import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';

export type LogsList = ResultSchemaType[ApiEndpoints.logsList];

export type LogsListRowType = {
  description: string;
  runtime: number;
  date: string;
  avgCost: number;
  avgAccuracy: number;
  p50Latency: number;
  p90Latency: number;
  params: string;
};

export interface LogsListContextType {
  logs: LogsList;
}

export type LogsMetadataColumnsPercentiles = {
  avgCostColumnP25: number;
  avgCostColumnP75: number;
  avgAccuracyColumnP25: number;
  avgAccuracyColumnP75: number;
  latencyP50ColumnP25: number;
  latencyP50ColumnP75: number;
  latencyP90ColumnP25: number;
  latencyP90ColumnP75: number;
};

export type LogsListAGGridContext = LogsMetadataColumnsPercentiles;
