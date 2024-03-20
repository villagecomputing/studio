import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';

export type ExperimentList = ResultSchemaType[ApiEndpoints.experimentList];
export type ExperimentRowType = {
  uuid: string;
  experimentName: string;
  date: string;
  datasetName: string;
};

export type ExperimentViewPageProps = {
  params: {
    experimentId: string;
  };
};
