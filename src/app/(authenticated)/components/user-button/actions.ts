'use server';

import ApiUtils from '@/lib/services/ApiUtils';

export default async function fetchApiKeyByExternalUserId(
  externaUserId: string,
) {
  return await ApiUtils.getUserApiKey({ externalUserId: externaUserId });
}
