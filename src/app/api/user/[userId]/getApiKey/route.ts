import ApiUtils from '@/lib/services/ApiUtils';

import { response } from '@/app/api/utils';
import { userGetApiKeyResponseSchema } from './schema';

/**
 * @swagger
 * /api/user/{userId}/getApiKey:
 *   get:
 *     tags:
 *      - User
 *     summary: Retrieve the details of a specific user by their Id.
 *     description: Retrieve the details of a specific user by their Id.
 *     operationId: GetUserApiKey
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
  try {
    const userId = params.userId;
    if (!userId) {
      return response('Invalid user id', 400);
    }

    const apiKeyResult = await ApiUtils.getUserApiKey(userId);
    const parsedApiKeyResult =
      userGetApiKeyResponseSchema.safeParse(apiKeyResult);
    if (!parsedApiKeyResult.success) {
      console.error(
        `Error while parsing user result: ${parsedApiKeyResult.error}`,
      );
      return response('Invalid response user view type', 500);
    }

    return Response.json({});
  } catch (error) {
    console.error('Error in GET user view:', error);
    return response('Error processing request', 500);
  }
}
