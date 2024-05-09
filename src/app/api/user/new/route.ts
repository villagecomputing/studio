import ApiUtils from '@/lib/services/ApiUtils';
import { response } from '../../utils';
import { newUserPayloadSchema } from './schema';

export async function POST(request: Request) {
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
