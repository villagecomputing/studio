import { newUserPayloadSchema } from '@/app/api/user/new/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';

import { generateUUID } from '@/lib/utils';
import PrismaClient from '../../prisma';

export async function newUser(
  payload: PayloadSchemaType[ApiEndpoints.userNew],
) {
  const params = newUserPayloadSchema.parse(payload);
  const { userExternalId } = params;
  const userId = generateUUID();

  // Add a new entry to the user table with the user details
  const user = await PrismaClient.user.create({
    data: {
      uuid: userId,
      external_id: userExternalId,
    },
  });

  return user.uuid;
}
