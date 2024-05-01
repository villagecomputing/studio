import { Prisma } from '@prisma/client';
import PrismaClient from '../../prisma';

export async function getExperimentDetails(
  experimentId: string,
  userId: string | null,
) {
  const columnSelect = {
    id: true,
    name: true,
    type: true,
    field: true,
  } satisfies Prisma.Experiment_columnSelect;

  const experimentSelect = {
    uuid: true,
    created_at: true,
    name: true,
    group_id: true,
    description: true,
    latency_p50: true,
    latency_p90: true,
    total_latency: true,
    total_cost: true,
    total_accuracy: true,
    total_rows: true,
    pipeline_metadata: true,
    Dataset: { select: { name: true, uuid: true } },
    Experiment_column: { select: columnSelect, where: { deleted_at: null } },
  } satisfies Prisma.ExperimentSelect;

  try {
    const result = await PrismaClient.experiment.findUniqueOrThrow({
      where: {
        uuid: experimentId,
        deleted_at: null,
        ...(userId ? { created_by: userId } : {}),
      },
      select: experimentSelect,
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get Experiment details');
  }
}
