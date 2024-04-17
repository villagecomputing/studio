import { getComponentForURL } from './getComponentForURL';
import { getURLsFromText } from './getURLsFromText';
import { ComponentProps } from './types';

export const urlHeadRequestCache = new Map<
  string,
  ((props: ComponentProps<object>) => JSX.Element) | null
>();

async function parseData(data: string): Promise<string[]> {
  const textURLs = getURLsFromText(data);

  if (!textURLs.length) {
    return [];
  }

  await Promise.all(
    textURLs.map(async (url) => {
      if (urlHeadRequestCache.has(url)) {
        return;
      }

      try {
        const component = await getComponentForURL(url);
        if (!component || component instanceof Error) {
          urlHeadRequestCache.set(url, null);
        } else {
          urlHeadRequestCache.set(url, component);
        }
      } catch (error) {
        urlHeadRequestCache.set(url, null);
      }
    }),
  );

  return textURLs;
}

export default { parseData };
