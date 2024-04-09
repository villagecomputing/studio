import { deleteUserPayloadSchema } from '@/app/api/user/delete/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import PrismaClient from '@/lib/services/prisma';

export async function deleteUser(
  payload: PayloadSchemaType[ApiEndpoints.userDelete],
) {
  const params = deleteUserPayloadSchema.parse(payload);
  const { userExternalId, id } = params;
  if (!id && !userExternalId) {
    throw new Error('Either id or userExternalId are required.');
  }

  try {
    if (id) {
      await PrismaClient.user.delete({
        where: { uuid: id },
      });
    } else if (userExternalId) {
      await PrismaClient.user.deleteMany({
        where: { external_id: userExternalId },
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete User.');
  }
}
