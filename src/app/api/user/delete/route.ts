import ApiUtils from '@/lib/services/ApiUtils';
import { NextRequest } from 'next/server';
import { hasApiAccess, response } from '../../utils';
import { deleteUserPayloadSchema } from './schema';

/**
 * @swagger
 * /api/user/new:
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
export async function POST(request: NextRequest) {
  if (!hasApiAccess(request)) {
    return response('Unauthorized', 401);
  }

  try {
    if (!request.headers.get('Content-Type')?.includes('application/json')) {
      return response('Invalid request headers type', 400);
    }
    const body = await request.json();
    const { id, userExternalId } = deleteUserPayloadSchema.parse(body);
    await ApiUtils.deleteUser({ id, userExternalId });

    return response('User deleted');
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
