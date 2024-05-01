import { response } from '@/app/api/utils';
import ApiUtils from '..';
import Logger, { LOGGER_TYPE } from '../../Logger';

const logger = Logger.getLogger({
  type: LOGGER_TYPE.DEFAULT,
  source: 'middleware',
});

export async function withAuthMiddleware(
  request: Request,
  handler: (userId: string | null) => Promise<Response>,
) {
  try {
    const userId = await ApiUtils.getAuthenticatedUserId(request);
    return handler(userId);
  } catch (error) {
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }
}
