import ApiUtils from '@/lib/services/ApiUtils';
import { response } from '../../utils';
import { newUserPayloadSchema } from './schema';

export async function POST(request: Request) {
  if (!request.headers.get('Content-Type')?.includes('application/json')) {
    return response('Invalid request headers type', 400);
  }

  let requestBody: string | undefined;
  try {
    requestBody = await request.json();
    if (!requestBody) {
      return response('Missing required data', 400);
    }

    // Parse the user data object using the defined schema
    // This will throw if the object doesn't match the schema
    const user = newUserPayloadSchema.parse(requestBody);
    const id = await ApiUtils.newUser(user);

    return Response.json({ id });
  } catch (error) {
    console.error('Error in POST:', error, { requestBody });
    return response('Error processing request', 500);
  }
}
