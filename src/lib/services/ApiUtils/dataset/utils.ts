import { ENUM_Column_type } from '@/lib/types';
import PrismaClient from '../../prisma';

export const getDatasetNameAndGTColumnField = async (
  datasetId: number,
): Promise<{ datasetName: string; groundTruthColumnField: string }> => {
  const dataset = await PrismaClient.dataset_list.findUniqueOrThrow({
    where: { id: datasetId },
    select: { name: true },
  });

  const groundTruthColumn = await PrismaClient.column.findFirstOrThrow({
    where: { dataset_id: datasetId, type: ENUM_Column_type.GROUND_TRUTH },
    select: { field: true },
  });
  return {
    datasetName: dataset.name,
    groundTruthColumnField: groundTruthColumn.field,
  };
};
