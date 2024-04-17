export type ExperimentGroupPageProps = {
  params: {
    groupId: string;
  };
};

export type ExperimentGroupRowType = {
  id: string;
  experimentName: string;
  runtime: number;
  date: string;
  avgCost: number;
  avgAccuracy: number;
  p50Latency: number;
  p90Latency: number;
};

export type GroupMetaInfo = {
  title: string;
  icon?: JSX.Element;
  value: string;
}[];

export type UseGroupSpecificDataResult = {
  datasetId: string;
  datasetName: string;
  description: string;
};

export type ExperimentsMetadataColumnsPercentiles = {
  avgCostColumnP25: number;
  avgCostColumnP75: number;
  avgAccuracyColumnP25: number;
  avgAccuracyColumnP75: number;
  latencyP50ColumnP25: number;
  latencyP50ColumnP75: number;
  latencyP90ColumnP25: number;
  latencyP90ColumnP75: number;
};

export type ExperimentsListAGGridContext =
  ExperimentsMetadataColumnsPercentiles;
