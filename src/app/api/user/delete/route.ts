import ApiUtils from '@/lib/services/ApiUtils';
import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
import Logger, { LOGGER_TYPE } from '@/lib/services/Logger';
import { response } from '../../utils';
import { deleteUserPayloadSchema } from './schema';

const logger = Logger.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'RevokeApiKey',
});
/**
 * @swagger
 * /api/user/delete:
 *   post:
 *     tags:
 *      - User
 *     summary: Delete user.
 *     description: Delete user by id or external id.
 *     operationId: DeleteUser
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteUserPayload'
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Invalid request headers type or Missing required data.
 *       500:
 *         description: Error processing request.
 */
export async function POST(request: Request) {
  return withAuthMiddleware(request, async (authenticatedUserId) => {
    try {
      if (!request.headers.get('Content-Type')?.includes('application/json')) {
        return response('Invalid request headers type', 400);
      }
      const body = await request.json();
      const { id: userId, userExternalId } =
        deleteUserPayloadSchema.parse(body);
      if (!userId || userId !== authenticatedUserId) {
        logger.warn('Invalid user id');
        return response('Invalid user id', 400);
      }
      await ApiUtils.deleteUser({ id: userId, userExternalId });

      return response('User deleted');
    } catch (error) {
      console.error('Error in POST:', error);
      return response('Error processing request', 500);
    }
  });
}
