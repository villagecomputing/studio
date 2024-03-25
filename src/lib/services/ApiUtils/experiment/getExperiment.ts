import { ExperimentTableColumnProps } from '@/app/(authenticated)/experiment/[experimentId]/types';
import { ResultSchemaType } from '@/lib/routes/routes';
import { guardStringEnum } from '@/lib/typeUtils';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { Prisma } from '@prisma/client';
import DatabaseUtils from '../../DatabaseUtils';
import PrismaClient from '../../prisma';

async function getExperimentContent(experimentTableName: string) {
  if (!experimentTableName) {
    throw new Error('experimentTableName is required');
  }

  try {
    const result =
      await DatabaseUtils.select<Record<string, string>>(experimentTableName);
    return result;
  } catch (error) {
    // Check if the error is because the table doesn't exist
    if (error instanceof Error && 'code' in error && error.code === 'P2010') {
      return [];
    } else {
      throw error;
    }
  }
}

export async function getExperimentDetails(experimentId: string) {
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
    avg_latency_p50: true,
    avg_latency_p90: true,
    total_cost: true,
    total_accuracy: true,
    total_rows: true,
    Experiment_column: { select: columnSelect, where: { deleted_at: null } },
  } satisfies Prisma.ExperimentSelect;

  try {
    const result = await PrismaClient.experiment.findUniqueOrThrow({
      where: { uuid: experimentId, deleted_at: null },
      select: experimentSelect,
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get Experiment details');
  }
}

export async function getExperiment(
  experimentId: string,
): Promise<ResultSchemaType['/api/experiment']> {
  if (!experimentId) {
    throw new Error('experimentId is required');
  }

  const experimentDetails = await getExperimentDetails(experimentId);
  if (!experimentDetails) {
    throw new Error('No experiment for id');
  }

  // Get database experiment content
  const experimentContent = await getExperimentContent(experimentId);

  // Map the columns
  const columns = experimentDetails.Experiment_column.map(
    (column): ExperimentTableColumnProps => {
      return {
        name: column.name,
        id: column.id,
        field: column.field,
        type: guardStringEnum(Enum_Experiment_Column_Type, column.type),
      };
    },
  );

  return {
    uuid: experimentDetails.uuid,
    name: experimentDetails.name,
    created_at: experimentDetails.created_at,
    columns,
    rows: experimentContent,
  };
}
