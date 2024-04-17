import { userRevokeApiKeyPayloadSchema } from '@/app/api/user/[userId]/revokeApiKey/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import PrismaClient from '../../prisma';
import { assertApiKeyFormat } from './utils';

export async function revokeUserApiKey({
  userId,
  payload,
}: {
  userId: string;
  payload: PayloadSchemaType[ApiEndpoints.userApiKeyRevoke];
}) {
  if (!userId) {
    throw new Error('User Id is required');
  }

  const { api_key } = userRevokeApiKeyPayloadSchema.parse(payload);
  assertApiKeyFormat(api_key);

  try {
    await PrismaClient.aPI_key.update({
      where: {
        user_id: userId,
        key: api_key,
      },
      data: {
        revoked_at: new Date(),
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get API key details');
  }
}
