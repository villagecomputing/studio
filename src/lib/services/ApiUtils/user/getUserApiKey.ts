import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';

import { Prisma } from '@prisma/client';
import PrismaClient from '../../prisma';
import { generateSecureApiKey } from './utils';

export async function getUserApiKey({
  externalUserId,
}: {
  externalUserId: string;
}): Promise<ResultSchemaType[ApiEndpoints.userApiKeyView]> {
  if (!externalUserId) {
    throw new Error('User Id is required');
  }

  const user = await PrismaClient.user.findFirstOrThrow({
    where: { external_id: externalUserId, deleted_at: null },
    select: { uuid: true },
  });

  const apiKeySelect = {
    key: true,
  } satisfies Prisma.API_keySelect;

  try {
    const apiKeyResult = await PrismaClient.aPI_key.findFirst({
      where: { user_id: user.uuid, revoked_at: null },
      select: apiKeySelect,
    });

    if (apiKeyResult?.key) {
      return {
        api_key: apiKeyResult?.key,
      };
    }

    const newApiKey = generateSecureApiKey();
    await PrismaClient.aPI_key.create({
      data: {
        key: newApiKey,
        user_id: user.uuid,
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
