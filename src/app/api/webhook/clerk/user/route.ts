import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
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

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'WebhookClerkUser',
});

export async function POST(request: Request) {
  const startTime = performance.now();
  try {
    // TODO: at some point we might consider verifying the request signature
    // Doc: https://clerk.com/docs/integrations/webhooks/sync-data

    if (!request.headers.get('Content-Type')?.includes('application/json')) {
      logger.warn('Invalid request headers type');
      return response('Invalid request headers type', 400);
    }

    const body = await request.json();
    const { data, type, object } = clerkUserPayloadSchema.parse(body);

    if (
      object !== CLERK_REQUEST_OBJECT.EVENT ||
      !isSomeStringEnum(CLERK_USER_REQUEST_TYPE, type)
    ) {
      logger.warn('Invalid request type', { type, object });
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
        throw Error('Not implemented');
    }

    logger.info('Clerk user webhook processed', {
      type,
      elapsedTimeMs: performance.now() - startTime,
    });
    return response('Ok');
  } catch (error) {
    logger.error('Error processing user webhook:', error);
    return response('Error processing request', 500);
  }
}
