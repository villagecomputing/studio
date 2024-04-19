import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { LOGGED_IN_USER_ID, X_API_KEY_HEADER } from './app/api/utils';
import { assertApiKeyFormat } from './lib/services/ApiUtils/user/utils';
import loggerFactory, { LOGGER_TYPE } from './lib/services/Logger';
import { isAuthEnabled } from './lib/utils';

// Cannot use Winston logger here - it doesn't work in the Edge Runtime
const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.DEFAULT,
  source: 'middleware',
});
export default authMiddleware({
  publicRoutes: [isAuthEnabled() ? '/api-doc' : '/(.*)', '/api/webhook(.*)'],
  afterAuth: async (auth, request) => {
    logger.debug('Incoming request:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    });

    if (auth.isPublicRoute || !isAuthEnabled()) {
      return NextResponse.next();
    }

    if (auth.userId) {
      // Endpoints need to be agnostic of clerk so instead of its using getAuth function to validate
      // we should add a user id header
      request.headers.set(LOGGED_IN_USER_ID, auth.userId || '');
      return NextResponse.next();
    }

    const xApiKey = request.headers.get(X_API_KEY_HEADER);
    if (xApiKey) {
      assertApiKeyFormat(xApiKey);
      return NextResponse.next();
    }

    return redirectToSignIn({ returnBackUrl: request.url });
  },
});

export const config = {
  matcher: [
    '/((?!.+.json|.+.ico|.+.jpg|.+.svg|.+.png|.+.[w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
