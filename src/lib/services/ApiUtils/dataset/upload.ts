import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/[datasetId]/utils/commonUtils';
import { ENUM_Column_type } from '@/lib/types';
import PrismaClient from '../../prisma';

type DataToSave = {
  columnHeaders: string[];
  groundTruthColumnIndex: number;
  groundTruthColumnContent: string[];
  totalNumberOfRows: number;
  filePath: string;
  fileTitle: string;
  fileSize: number;
  fileType: string;
};

export async function saveDatasetDetails(
  dataToSave: DataToSave,
): Promise<{ datasetId: number }> {
  const { columnHeaders, groundTruthColumnIndex, fileTitle } = dataToSave;

  const datasetColumns = columnHeaders.map((header, index) => {
    return {
      field: getColumnFieldFromNameAndIndex(header, index),
      name: header,
      index: index,
      type:
        index === groundTruthColumnIndex
          ? ENUM_Column_type.GROUND_TRUTH
          : ENUM_Column_type.INPUT,
    };
  });
  const datasetResult = await PrismaClient.dataset_list.create({
    data: {
      name: fileTitle,

      Column: {
        create: datasetColumns,
      },
    },
  });
  const groundTruthColumnId = await PrismaClient.column.findFirst({
    where: {
      dataset_id: { equals: datasetResult.id },
      type: { equals: ENUM_Column_type.GROUND_TRUTH },
    },
    select: {
      id: true,
    },
  });

  if (!groundTruthColumnId) {
    throw new Error('Ground truth column was not found');
  }

  // TODO this might be dangerous since we are creating many inserts but there is no createMany function in prisma when using sqlite
  // const inserts = dataToSave.groundTruthColumnContent.map((cell) =>
  //   PrismaClient.ground_truth_cell.create({
  //     data: {
  //       content: cell,
  //       column_id: groundTruthColumnId.id,
  //       status: ENUM_Ground_truth_status.PENDING,
  //     },
  //   }),
  // );
  // await PrismaClient.$transaction(inserts);
  return { datasetId: datasetResult.id };
}
