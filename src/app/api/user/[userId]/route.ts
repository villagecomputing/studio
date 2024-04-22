import ApiUtils from '@/lib/services/ApiUtils';
import { hasApiAccess, response } from '../../utils';
import { userViewResponseSchema } from './schema';

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
  if (!(await hasApiAccess(request))) {
    return response('Unauthorized', 401);
  }

  try {
    const userId = params.userId;
    if (!userId) {
      return response('Invalid user id', 400);
    }

    const user = await ApiUtils.getUser(userId);

    const parsedUser = userViewResponseSchema.safeParse(user);
    if (!parsedUser.success) {
      console.error(`Error while parsing user result: ${parsedUser.error}`);
      return response('Error processing request', 500);
    }

    return Response.json(user);
  } catch (error) {
    console.error('Error in GET user view:', error);
    return response('Error processing request', 500);
  }
}
