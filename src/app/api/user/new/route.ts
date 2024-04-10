import ApiUtils from '@/lib/services/ApiUtils';
import { NextRequest } from 'next/server';
import { hasApiAccess, response } from '../../utils';
import { newUserPayloadSchema } from './schema';

/**
 * @swagger
 * /api/user/new:
 *   post:
 *     tags:
 *      - User
 *     summary: Creates a new user.
 *     description: Creates a new user.
 *     operationId: CreateUser
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUserPayload'
 *     responses:
 *       200:
 *         description: Successfully created a new user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewUserResponse'
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
    if (!body) {
      return response('Missing required data', 400);
    }

    // Parse the user data object using the defined schema
    // This will throw if the object doesn't match the schema
    const user = newUserPayloadSchema.parse(body);
    const id = await ApiUtils.newUser(user);

    return Response.json({ id });
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
