import { guardStringEnum } from '@/lib/typeUtils';
import { ReactElement } from 'react';
import {
  MimeTypes,
  SupportedFormat,
  fileExtensionRegex,
  mimeTypeToComponent,
} from './constants';

export async function getComponentForURL(
  url: string,
): Promise<ReactElement | undefined | Error> {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    if (contentType) {
      for (const [format, type] of Object.entries(MimeTypes)) {
        if (contentType.includes(type)) {
          return mimeTypeToComponent[format];
        }
      }
    }

    // Fallback to regex if content type is not conclusive
    for (const [type, regex] of Object.entries(fileExtensionRegex)) {
      if (regex.test(url)) {
        const format = guardStringEnum(SupportedFormat, type);
        if (format === SupportedFormat.MARKDOWN) {
          return;
        }
        return mimeTypeToComponent[MimeTypes[SupportedFormat[format]]];
      }
    }

    return;
  } catch (error) {
    // Assuming 'error' is of type any to handle cases where error.response may not exist
    if (error instanceof Response && error.status) {
      if (error.status === 404) {
        return Error('URL not found (404)');
      } else if (error.status === 403) {
        return Error('Access forbidden (403)');
      }
    }
    return Error('Broken or unreachable URL');
  }
}
