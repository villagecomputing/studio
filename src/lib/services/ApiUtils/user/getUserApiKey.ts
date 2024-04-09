import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';

import { Prisma } from '@prisma/client';
import PrismaClient from '../../prisma';
import { generateSecureApiKey } from './utils';

export async function getUserApiKey(
  userId: string,
): Promise<ResultSchemaType[ApiEndpoints.userApiKeyView]> {
  if (!userId) {
    throw new Error('DatasetId is required');
  }

  const apiKeySelect = {
    id: true,
  } satisfies Prisma.API_keySelect;

  try {
    const apiKeyResult = await PrismaClient.aPI_key.findFirst({
      where: { user_id: userId, revoked_at: null },
      select: apiKeySelect,
    });

    if (apiKeyResult?.id) {
      return {
        api_key: apiKeyResult?.id,
      };
    }

    const newApiKey = generateSecureApiKey();
    await PrismaClient.aPI_key.create({
      data: {
        id: newApiKey,
        user_id: userId,
      },
    });

    return {
      api_key: newApiKey,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get API key details');
  }
}
