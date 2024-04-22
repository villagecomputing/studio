import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';

import { hasApiAccess, response } from '@/app/api/utils';
import { userGetApiKeyResponseSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'GetUserApiKey',
});

/**
 * @swagger
 * /api/user/{userId}/getApiKey:
 *   get:
 *     tags:
 *      - User
 *     summary: Retrieves user's API Key.
 *     description: Retrieves and existing active API key or generates a new one.
 *     operationId: GetUserApiKey
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's API key.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserApiKeyResponse'
 *       400:
 *         description: Invalid user Id provided.
 *       500:
 *         description: Internal server error occurred while processing the request.
 */
export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const startTime = performance.now();
  if (!(await hasApiAccess(request))) {
    return response('Unauthorized', 401);
  }

  try {
    const userId = params.userId;
    if (!userId) {
      logger.warn('Invalid user id provided');
      return response('Invalid user id', 400);
    }
    const user = await ApiUtils.getUser(userId);
    const apiKeyResult = await ApiUtils.getUserApiKey({
      externalUserId: user.external_id,
    });
    const parsedApiKeyResult =
      userGetApiKeyResponseSchema.safeParse(apiKeyResult);
    if (!parsedApiKeyResult.success) {
      logger.error(
        `Error while parsing user result: ${parsedApiKeyResult.error}`,
      );
      return response('Invalid response user view type', 500);
    }

    logger.info("Successfully retrieved the user's API key", {
      userId,
      elapsedTimeMs: performance.now() - startTime,
    });
    return Response.json(apiKeyResult);
  } catch (error) {
    logger.error('Error getting user API key:', {
      error,
      userId: params.userId,
    });
    return response('Error processing request', 500);
  }
}
