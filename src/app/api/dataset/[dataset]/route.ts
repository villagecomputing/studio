import { PrismaClient } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { response } from '../../utils';
import { datasetViewResponseSchema } from './schema';

export async function GET(
  request: Request,
  { params }: { params: { dataset: string } },
) {
  try {
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

    const result = await PrismaClient.dataset.findUniqueOrThrow({
      where: { id: Number(params.dataset), deleted_at: null },
      select: datasetSelect,
    });

    if (!datasetViewResponseSchema.safeParse(result)) {
      return response('Invalid response dataset view type', 400);
    }

    const res = JSON.stringify(result);
    return Response.json(res);
  } catch (error) {
    console.error('Error in GET dataset view:', error);
    return response('Error processing request', 500);
  }
}
