import PrismaClient from '../prisma';

export async function getExperimentOrThrow(experimentId: string) {
  return await PrismaClient.experiment.findUniqueOrThrow({
    where: {
      uuid: experimentId,
    },
  });
}

export async function getDatasetOrThrow(datasetId: string) {
  return await PrismaClient.dataset.findUniqueOrThrow({
    where: {
      uuid: datasetId,
    },
  });
}
