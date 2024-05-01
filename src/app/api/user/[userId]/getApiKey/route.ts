import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';

import { response } from '@/app/api/utils';
import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
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
  return withAuthMiddleware(request, async (authenticatedUserId) => {
    const startTime = performance.now();

    try {
      const userId = params.userId;
      if (!userId || userId !== authenticatedUserId) {
        logger.warn('Invalid user id provided');
        return response('Invalid user id', 400);
      }
      const user = await ApiUtils.getUserByUserId(userId);
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
  });
}
