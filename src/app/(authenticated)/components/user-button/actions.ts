'use server';

import ApiUtils from '@/lib/services/ApiUtils';

export default async function fetchApiKey(userId: string) {
  return await ApiUtils.getUserApiKey(userId);
}
