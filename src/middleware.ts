import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { assertApiKeyFormat } from './lib/services/ApiUtils/user/utils';

export default authMiddleware({
  publicRoutes: [
    '/api/webhook(.*)',
    '/api-doc',
    // TODO: this endpoint should be removed from public as soon as the UI for getting the API Key is done
    '/api/user/(.*)/getApiKey',
  ],
  afterAuth: async (auth, request) => {
    if (auth.userId || auth.isPublicRoute) {
      return NextResponse.next();
    }

    const xApiKey = request.headers.get('x-api-key');
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
