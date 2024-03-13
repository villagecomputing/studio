'use server';

import ApiUtils from '@/lib/services/ApiUtils';

export async function isDatasetNameAvailable(name: string): Promise<boolean> {
  return await ApiUtils.isDatasetNameAvailable(name);
}
