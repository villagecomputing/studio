import { LOGGED_IN_USER_ID, X_API_KEY_HEADER } from '@/app/api/utils';
import { isAuthEnabled } from '@/lib/utils';
import ApiUtils from '..';
import {
  assertApiKeyExists,
  assertUserExists,
} from '../../DatabaseUtils/common';

export async function getAuthenticatedUserId(
  request: Request,
): Promise<string | null> {
  if (!isAuthEnabled()) {
    return null;
  }

  const userId = request.headers.get(LOGGED_IN_USER_ID);
  if (userId) {
    await assertUserExists(userId);
    return userId;
  }

  const xApiKey = request.headers.get(X_API_KEY_HEADER);
  if (xApiKey) {
    await assertApiKeyExists(xApiKey);
    const user = await ApiUtils.getUserByApiKey(xApiKey);
    return user.id;
  }

  throw new Error('Unauthorized');
}
