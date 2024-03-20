import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import PrismaClient from '@/lib/services/prisma';
import { Prisma } from '@prisma/client';
import { response } from '../../utils';
import { experimentListResponseSchema } from './schema';

export async function GET() {
  try {
    const experimentSelect = {
      uuid: true,
      name: true,
      created_at: true,
      Dataset_list: {
        select: {
          id: true,
          name: true,
        },
      },
    } satisfies Prisma.ExperimentSelect;

    const experimentList = await PrismaClient.experiment.findMany({
      select: experimentSelect,
      where: { deleted_at: null },
    });

    const experimentListResponse: ResultSchemaType[ApiEndpoints.experimentList] =
      await Promise.all(
        experimentList.map(async (dataset) => {
          return {
            ...dataset,
            created_at: dataset.created_at.toDateString(),
          };
        }),
      );

    if (!experimentListResponseSchema.safeParse(experimentListResponse)) {
      return response('Invalid response datasetList type', 400);
    }

    const res = JSON.stringify(experimentListResponse);
    return Response.json(res);
  } catch (error) {
    console.error('Error in GET experiment list:', error);
    return response('Error processing request', 500);
  }
}
