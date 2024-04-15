import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { LOGGED_IN_USER_ID, X_API_KEY_HEADER } from './app/api/utils';
import { assertApiKeyFormat } from './lib/services/ApiUtils/user/utils';
import { isAuthEnabled } from './lib/utils';

export default authMiddleware({
  publicRoutes: [
    isAuthEnabled() ? '/api-doc' : '/(.*)',
    '/api/webhook(.*)',
    // TODO: this endpoint should be removed from public as soon as the UI for getting the API Key is done
    '/api/user/(.*)/getApiKey',
    '/api/user/new',
  ],
  afterAuth: async (auth, request) => {
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
  matcher: ['/((?!.+.[w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
