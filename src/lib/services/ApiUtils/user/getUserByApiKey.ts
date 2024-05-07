import { Prisma } from '@prisma/client';
import PrismaClient from '../../prisma';

export async function getUserByApiKey(apiKey: string) {
  if (!apiKey) {
    throw new Error('ApiKey is required');
  }

  const userSelect = {
    uuid: true,
    external_id: true,
    created_at: true,
  } satisfies Prisma.UserSelect;

  try {
    const user = await PrismaClient.user.findFirstOrThrow({
      where: {
        API_key: {
          some: {
            key: { equals: apiKey },
          },
        },
        deleted_at: null,
      },
      select: userSelect,
    });
    return {
      id: user.uuid,
      external_id: user.external_id,
      created_at: user.created_at,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get User details for API key');
  }
}
