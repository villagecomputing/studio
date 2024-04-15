'use server';
import { ParserError } from '@/lib/services/DatasetParser';

import ApiUtils from '@/lib/services/ApiUtils';

export const fetchUserApiKey = async (
  userId: string,
): Promise<string | undefined> => {
  try {
    const key = await ApiUtils.getUserApiKey(userId);
    return key?.api_key;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error((error as ParserError).message);
  }
};
