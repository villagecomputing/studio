import { hasApiAccess, response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { userRevokeApiKeyPayloadSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'RevokeApiKey',
});

/**
 * @swagger
 * /api/user/{userId}/revokeApiKey:
 *   post:
 *     tags:
 *      - User
 *     summary: Revokes the specified api key.
 *     description: Revokes the specified api key.
 *     operationId: RevokeApiKey
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user.
 *     requestBody:
 *       description: Data to be added to the dataset
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRevokeApiKeyPayload'
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Invalid user Id provided.
 *       500:
 *         description: Internal server error occurred while processing the request.
 */
export async function POST(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const startTime = performance.now();
  if (!(await hasApiAccess(request))) {
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }

  try {
    const userId = params.userId;
    if (!userId) {
      logger.warn('Invalid user id');
      return response('Invalid user id', 400);
    }
    const body = await request.json();
    const payload = userRevokeApiKeyPayloadSchema.parse(body);
    await ApiUtils.revokeUserApiKey({
      userId: userId,
      payload: payload,
    });

    logger.info('API key revoked', {
      userId,
      elapsedTimeMs: performance.now() - startTime,
    });
    return response('OK');
  } catch (error) {
    logger.error('Error revoking api key', error);
    return response('Error processing request', 500);
  }
}
