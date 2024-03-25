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
  avgCost: string;
  avgLatency: string;
  avgAccuracy: string;
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
