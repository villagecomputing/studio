import { assertApiKeyExists } from '@/lib/services/DatabaseUtils/common';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export function response(message: string, status: 200 | 400 | 401 | 500 = 200) {
  return new Response(JSON.stringify({ message }), {
    headers: { 'Content-Type': 'application/json' },
    status,
  });
}

export async function hasApiAccess(request: NextRequest) {
  const auth = getAuth(request);
  if (auth.userId) {
    return true;
  }

  try {
    const xApiKey = request.headers.get('x-api-key');
    if (xApiKey) {
      await assertApiKeyExists(xApiKey);
    }
    return true;
  } catch (error) {
    console.error('Error checking validating API key:', error);
    return false;
  }
}
