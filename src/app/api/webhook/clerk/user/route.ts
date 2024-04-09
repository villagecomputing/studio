import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { guardStringEnum, isSomeStringEnum } from '@/lib/typeUtils';
import { clerkUserPayloadSchema } from './schema';

enum CLERK_REQUEST_OBJECT {
  EVENT = 'event',
}

enum CLERK_USER_REQUEST_TYPE {
  CREATE = 'user.created',
  DELETE = 'user.deleted',
  UPDATE = 'user.updated',
}

/**
 * @swagger
 * /api/webhook/clerk/user:
 *   post:
 *     tags:
 *      - Webhook
 *     summary: Creates, deletes or updates a clerk user .
 *     description: This endpoint is called by clerk when new users are created, deleted, or updated.
 *     operationId: WebhookClerkUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClerkUserWebhookPayload'
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Invalid request headers type or Missing required data.
 *       500:
 *         description: Error processing request.
 */
export async function POST(request: Request) {
  try {
    if (!request.headers.get('Content-Type')?.includes('application/json')) {
      return response('Invalid request headers type', 400);
    }

    const body = await request.json();
    const { data, type, object } = clerkUserPayloadSchema.parse(body);

    if (
      object !== CLERK_REQUEST_OBJECT.EVENT ||
      !isSomeStringEnum(CLERK_USER_REQUEST_TYPE, type)
    ) {
      return response('Invalid request type', 400);
    }

    switch (guardStringEnum(CLERK_USER_REQUEST_TYPE, type)) {
      case CLERK_USER_REQUEST_TYPE.CREATE:
        await ApiUtils.newUser({ userExternalId: data.id });
        break;
      case CLERK_USER_REQUEST_TYPE.DELETE:
        await ApiUtils.deleteUser({ userExternalId: data.id });
        break;
      case CLERK_USER_REQUEST_TYPE.UPDATE:
        throw Error('Not impletmented');
    }

    return response('Ok');
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
