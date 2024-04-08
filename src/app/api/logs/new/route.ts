import PrismaClient from '@/lib/services/prisma';
import { UUIDPrefixEnum, createFakeId, generateUUID } from '@/lib/utils';
import { response } from '../../utils';
import { newLogsPayloadSchema } from './schema';

/**
 * @swagger
 * /api/logs/new:
 *   post:
 *     tags:
 *      - Logs
 *     summary: Creates a new logs entry
 *     description: Creates a new logs entry
 *     operationId: CreateLogs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewLogsPayload'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewLogsResponse'
 *       500:
 *         description: 'Error processing request'
 */
export async function POST(request: Request) {
  const requestBody = await request.json();
  const payload = newLogsPayloadSchema.parse(requestBody);

  try {
    const id = generateUUID(UUIDPrefixEnum.LOGS);

    await PrismaClient.logs.create({
      data: {
        uuid: id,
        name: payload.name,
        description: payload.description,
        pipeline_metadata: JSON.stringify(payload.parameters),
      },
    });
    return Response.json({ id: createFakeId(payload.name, id) });
  } catch (error) {
    console.error('Error in newLogs:', error);
    return response('Error processing request', 500);
  }
}
