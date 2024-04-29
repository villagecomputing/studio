import { SupportedFormat } from './constants';
import { getFormatForURL } from './getFormatForURL';
import { getURLsFromText } from './getURLsFromText';

export const urlHeadRequestCache: Record<string, SupportedFormat | null> = {};

async function parseData(data: string): Promise<string[]> {
  const textURLs = getURLsFromText(data);

  if (!textURLs.length) {
    return [];
  }

  await Promise.all(
    textURLs.map(async (url) => {
      if (Object.hasOwn(urlHeadRequestCache, url)) {
        return;
      }

      try {
        const format = await getFormatForURL(url);
        urlHeadRequestCache[url] = format || null;
      } catch (error) {
        urlHeadRequestCache[url] = null;
        // Assuming 'error' is of type any to handle cases where error.response may not exist
        if (error instanceof Response && error.status) {
          if (error.status === 404) {
            return Error('URL not found (404)');
          } else if (error.status === 403) {
            return Error('Access forbidden (403)');
          }
        }
      }
    }),
  );

  return textURLs;
}

export default { parseData };
