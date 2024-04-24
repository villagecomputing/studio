import { guardStringEnum } from '@/lib/typeUtils';
import { MimeTypes, SupportedFormat, fileExtensionRegex } from './constants';

export async function getFormatForURL(
  url: string,
): Promise<SupportedFormat | null> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    if (contentType) {
      for (const [format, mimeType] of Object.entries(MimeTypes)) {
        if (contentType.includes(mimeType)) {
          return guardStringEnum(SupportedFormat, format);
        }
      }
    }

    // Fallback to regex if content type is not conclusive
    for (const [format, regex] of Object.entries(fileExtensionRegex)) {
      if (regex.test(url)) {
        return guardStringEnum(SupportedFormat, format);
      }
    }

    return null;
  } catch (error) {
    for (const [format, regex] of Object.entries(fileExtensionRegex)) {
      if (regex.test(url)) {
        return guardStringEnum(SupportedFormat, format);
      }
    }
    throw error;
  }
}
