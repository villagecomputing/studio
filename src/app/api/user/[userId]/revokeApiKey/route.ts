import ApiUtils from '@/lib/services/ApiUtils';

import { response } from '@/app/api/utils';
import { userRevokeApiKeyPayloadSchema } from './schema';

/**
 * @swagger
 * /api/user/{userId}/revokeApiKey:
 *   post:
 *     tags:
 *      - User
 *     summary: Revokes the specified api key.
 *     description: Revokes the specified api key.
 *     operationId: RevokeApiKey
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
export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const userId = params.userId;
    if (!userId) {
      return response('Invalid user id', 400);
    }
    const payload = userRevokeApiKeyPayloadSchema.parse(request);
    await ApiUtils.revokeUserApiKey({
      userId: userId,
      payload: payload,
    });

    return response('OK');
  } catch (error) {
    console.error('Error in POST revoke api key:', error);
    return response('Error processing request', 500);
  }
}
