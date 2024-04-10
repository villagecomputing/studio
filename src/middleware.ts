import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { response } from './app/api/utils';
import { validateApiKey } from './lib/services/ApiUtils/user/utils';
import { assertValidApiKeyExists } from './lib/services/DatabaseUtils/common';

export default authMiddleware({
  publicRoutes: [
    '/api/webhook(.*)',
    '/api-doc',
    '/api/user/(.*)/getApiKey',
    '/api/user/(.*)/revokeApiKey',
  ],
  afterAuth(auth, req) {
    if (auth.userId || auth.isPublicRoute) {
      return NextResponse.next();
    }

    const xApiKey = req.headers.get('x-api-key');
    if (xApiKey) {
      validateApiKey(xApiKey);
      //TODO: await... or move to individual endpoints
      assertValidApiKeyExists(xApiKey);
      return response('Invalid dataset id', 400);
    }

    return redirectToSignIn({ returnBackUrl: req.url });
  },
});

export const config = {
  matcher: ['/((?!.+.[w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
