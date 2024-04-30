import { Prisma } from '@prisma/client';
import PrismaClient from '../../prisma';

export async function getLogsDetails(logsId: string, userId: string | null) {
  const columnSelect = {
    id: true,
    name: true,
    type: true,
    field: true,
  } satisfies Prisma.Logs_columnSelect;

  const logsSelect = {
    uuid: true,
    created_at: true,
    name: true,
    description: true,
    latency_p50: true,
    latency_p90: true,
    total_latency: true,
    total_cost: true,
    total_accuracy: true,
    total_rows: true,
    pipeline_metadata: true,
    Dataset: {
      select: {
        uuid: true,
      },
    },
    Logs_column: {
      select: columnSelect,
      where: { deleted_at: null, ...(userId ? { created_by: userId } : {}) },
    },
  } satisfies Prisma.LogsSelect;

  try {
    const result = await PrismaClient.logs.findUniqueOrThrow({
      where: { uuid: logsId, deleted_at: null },
      select: logsSelect,
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get Logs details');
  }
}
