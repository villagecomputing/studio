import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import PrismaClient from '../../prisma';
import { getExperimentDetails } from './getExperiment';
export async function updateExperiment(
  experimentId: string,
  _payload: PayloadSchemaType[ApiEndpoints.experimentInsert],
) {
  try {
    const _experimentDetails = await getExperimentDetails(experimentId);
    // TODO: process payload, update experimentDetails
    const result = await PrismaClient.experiment.update({
      where: { uuid: experimentId },
      data: {},
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error inserting data');
  }
}
