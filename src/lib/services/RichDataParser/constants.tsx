export enum SupportedFormat {
  'PDF' = 'PDF',
  'IMAGE' = 'IMAGE',
  'MARKDOWN' = 'MARKDOWN',
}

export const MimeTypes = {
  [SupportedFormat.PDF]: 'application/pdf',
  [SupportedFormat.IMAGE]: 'image/',
};

// Regex patterns for file extensions
export const fileExtensionRegex = {
  [SupportedFormat.IMAGE]: /\.(jpeg|jpg|gif|png|svg)(\?.*)?$/i,
  [SupportedFormat.PDF]: /\.pdf(\?.*)?$/i,
  [SupportedFormat.MARKDOWN]:
    /(\*\*|__|\*|_|~~|\[.*?\]\(.*?\)|<("[^"]*"|'[^']*'|[^'">])*>)/,
};
