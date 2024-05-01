import { LOGGED_IN_USER_ID, X_API_KEY_HEADER } from '@/app/api/utils';
import { isAuthEnabled } from '@/lib/utils';
import ApiUtils from '..';

export async function getAuthenticatedUserId(
  request: Request,
): Promise<string | null> {
  if (!isAuthEnabled()) {
    return null;
  }

  const externalUserId = request.headers.get(LOGGED_IN_USER_ID);
  if (externalUserId) {
    const user = await ApiUtils.getUserByExternalUserId(externalUserId);
    return user.id;
  }

  const xApiKey = request.headers.get(X_API_KEY_HEADER);
  if (xApiKey) {
    const user = await ApiUtils.getUserByApiKey(xApiKey);
    return user.id;
  }

  throw new Error('Unauthorized');
}
