import { editDatasetColumnSchema } from '@/app/api/dataset/edit/column/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Column_type } from '@/lib/types';
import PrismaClient from '../../prisma';

export async function editDatasetColumn(
  payload: PayloadSchemaType[ApiEndpoints.datasetColumnEdit],
) {
  try {
    const params = editDatasetColumnSchema.parse(payload);
    const { columnId, name, type } = params;

    // Prepare the data for update
    const updateData: { name?: string; type?: ENUM_Column_type } = {};
    if (name) {
      updateData.name = name;
    }
    if (type) {
      updateData.type = type;
    }

    if (type === ENUM_Column_type.GROUND_TRUTH) {
      // TODO: Implement editing logic for Ground Truth column
      return columnId;
    }

    const updatedColumn = await PrismaClient.column.update({
      where: { id: columnId },
      data: updateData,
    });

    return updatedColumn.id;
  } catch (error) {
    console.error(error);
    throw new Error('Error updating column');
  }
}
