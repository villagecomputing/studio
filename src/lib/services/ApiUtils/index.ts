import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';

async function getDatasetDetails(datasetId: number) {
  const groundTruthSelect = {
    id: true,
    status: true,
    content: true,
    column_id: true,
  } satisfies Prisma.Ground_truth_cellSelect;

  const columnSelect = {
    id: true,
    name: true,
    type: true,
    index: true,
    Ground_truth_cell: { select: groundTruthSelect },
  } satisfies Prisma.Dataset_columnSelect;

  const datasetSelect = {
    id: true,
    file_location: true,
    file_name: true,
    total_rows: true,
    Dataset_column: { select: columnSelect, where: { deleted_at: null } },
  } satisfies Prisma.DatasetSelect;

  try {
    const result = await PrismaClient.dataset.findUniqueOrThrow({
      where: { id: Number(datasetId), deleted_at: null },
      select: datasetSelect,
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get Dataset details');
  }
}

export default { getDatasetDetails };
