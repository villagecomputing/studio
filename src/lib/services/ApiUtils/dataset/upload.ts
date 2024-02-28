import {
  ENUM_Column_type,
  ENUM_Data_type,
  ENUM_Ground_truth_status,
} from '@/lib/types';
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

export async function isFilenameAvailable(filename: string): Promise<boolean> {
  const trimmedFilename = filename.trim();
  if (!trimmedFilename) {
    return false;
  }

  const totalFilesWithSameFilename = await PrismaClient.dataset.count({
    where: {
      file_name: {
        equals: trimmedFilename,
      },
    },
  });

  return !totalFilesWithSameFilename;
}

export async function saveDatasetDetails(dataToSave: DataToSave) {
  const {
    columnHeaders,
    groundTruthColumnIndex,
    totalNumberOfRows,
    filePath,
    fileTitle,
    fileSize,
    fileType,
  } = dataToSave;

  const datasetColumns = columnHeaders.map((header, index) => {
    return {
      name: header,
      index: index,
      dataType: ENUM_Data_type.STRING,
      type:
        index === groundTruthColumnIndex
          ? ENUM_Column_type.GROUND_TRUTH
          : ENUM_Column_type.INPUT,
    };
  });
  const datasetResult = await PrismaClient.dataset.create({
    data: {
      file_location: filePath,
      file_name: fileTitle,
      file_size: fileSize,
      total_rows: totalNumberOfRows,
      file_type: fileType,

      Dataset_column: {
        create: datasetColumns,
      },
    },
  });
  const groundTruthColumnId = await PrismaClient.dataset_column.findFirst({
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
  const inserts = dataToSave.groundTruthColumnContent.map((cell) =>
    PrismaClient.ground_truth_cell.create({
      data: {
        content: cell,
        column_id: groundTruthColumnId.id,
        status: ENUM_Ground_truth_status.PENDING,
      },
    }),
  );
  await PrismaClient.$transaction(inserts);
}
