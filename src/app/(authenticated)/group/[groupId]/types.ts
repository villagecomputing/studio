export type ExperimentGroupPageProps = {
  params: {
    groupId: string;
  };
};

export type ExperimentGroupRowType = {
  id: string;
  experimentName: string;
  runtime: string;
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
  meta: GroupMetaInfo;
};
