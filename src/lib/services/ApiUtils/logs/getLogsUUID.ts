import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { UUIDPrefixEnum, generateUUID } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import PrismaClient from '../../prisma';

export const getLogsUUID = async (
  payload: PayloadSchemaType[ApiEndpoints.logsInsert],
): Promise<string> => {
  const existingLogs = await PrismaClient.logs.findFirst({
    select: { uuid: true },
    where: {
      fingerprint: payload.fingerprint,
      deleted_at: null,
    },
  });
  if (existingLogs) {
    return existingLogs.uuid;
  }
  const logsInput = {
    uuid: generateUUID(UUIDPrefixEnum.LOGS),
    name: payload.name,
    description: payload.description,
    pipeline_metadata: JSON.stringify(payload.parameters),
    fingerprint: payload.fingerprint,
  } satisfies Prisma.LogsCreateInput;
  const logs = await PrismaClient.logs.create({
    data: logsInput,
  });

  return logs.uuid;
};
