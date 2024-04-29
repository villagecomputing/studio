import { SupportedFormat, fileExtensionRegex } from './constants';

export function isMarkdownContent(text: string): boolean {
  const markdownRegex = fileExtensionRegex[SupportedFormat.MARKDOWN];
  return markdownRegex.test(text);
}
