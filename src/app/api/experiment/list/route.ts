import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '@/lib/services/DatabaseUtils';
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
      group_id: true,
      pipeline_metadata: true,
      Dataset: {
        select: {
          uuid: true,
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
        experimentList.map(async (experiment) => {
          let totalRows = 0;
          try {
            const result = await DatabaseUtils.selectAggregation(
              experiment.uuid,
              {
                func: 'COUNT',
              },
            );
            totalRows = Number(result);
          } catch (error) {}

          return {
            ...experiment,
            id: experiment.uuid,
            groupId: experiment.group_id,
            pipelineMetadata: experiment.pipeline_metadata,
            created_at: experiment.created_at.toDateString(),
            totalRows,
            Dataset: {
              ...experiment.Dataset,
              id: experiment.Dataset.uuid,
            },
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
