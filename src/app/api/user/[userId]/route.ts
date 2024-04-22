import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { hasApiAccess, response } from '../../utils';
import { userViewResponseSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'GetUserData',
});

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     tags:
 *      - User
 *     summary: Retrieve the details of a specific user by their Id.
 *     description: Retrieve the details of a specific user by their Id.
 *     operationId: GetUserData
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
 *         description: Successfully retrieved the user details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserViewResponse'
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
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }

  try {
    const userId = params.userId;
    if (!userId) {
      logger.warn('Invalid user id');
      return response('Invalid user id', 400);
    }

    const user = await ApiUtils.getUser(userId);

    const parsedUser = userViewResponseSchema.safeParse(user);
    if (!parsedUser.success) {
      console.error(`Error while parsing user result: ${parsedUser.error}`);
      return response('Error processing request', 500);
    }

    logger.info('User details retrieved', {
      userId,
      elapsedTimeMs: performance.now() - startTime,
    });

    return Response.json(user);
  } catch (error) {
    logger.error('Error in GET user view:', error);
    return response('Error processing request', 500);
  }
}
