import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import { Prisma } from '@prisma/client';
import PrismaClient from '../../prisma';

export async function getUserByUserId(
  userId: string,
): Promise<ResultSchemaType[ApiEndpoints.userView]> {
  if (!userId) {
    throw new Error('User Id is required');
  }

  const userSelect = {
    uuid: true,
    external_id: true,
    created_at: true,
  } satisfies Prisma.UserSelect;

  try {
    const user = await PrismaClient.user.findUniqueOrThrow({
      where: { uuid: userId, deleted_at: null },
      select: userSelect,
    });
    return {
      id: user.uuid,
      external_id: user.external_id,
      created_at: user.created_at,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get User details');
  }
}
