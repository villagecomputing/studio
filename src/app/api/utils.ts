import {
  assertApiKeyExists,
  assertUserExists,
} from '@/lib/services/DatabaseUtils/common';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { isAuthEnabled } from '@/lib/utils';

export const X_API_KEY_HEADER = 'x-api-key';
export const LOGGED_IN_USER_ID = 'logged_in_user_id';

// Cannot use Winston logger here - it doesn't work in the Edge Runtime
const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.DEFAULT,
  source: 'apiAccessCheck',
});

export function response(message: string, status: 200 | 400 | 401 | 500 = 200) {
  return new Response(JSON.stringify({ message }), {
    headers: { 'Content-Type': 'application/json' },
    status,
  });
}

export async function hasApiAccess(request: Request) {
  try {
    if (!isAuthEnabled()) {
      return true;
    }

    const userId = request.headers.get(LOGGED_IN_USER_ID);
    if (userId) {
      await assertUserExists(userId);
      return true;
    }

    const xApiKey = request.headers.get(X_API_KEY_HEADER);
    if (xApiKey) {
      await assertApiKeyExists(xApiKey);
      return true;
    }
  } catch (error) {
    logger.error('Error checking api access:', error);
  }

  return false;
}
