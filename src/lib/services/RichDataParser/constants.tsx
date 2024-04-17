import Image from 'next/image';
import { ComponentProps, MimeTypeToComponent } from './types';

export enum SupportedFormat {
  'PDF' = 'PDF',
  'IMAGE' = 'IMAGE',
  'MARKDOWN' = 'MARKDOWN',
}

export const MimeTypes = {
  [SupportedFormat.PDF]: 'application/pdf',
  [SupportedFormat.IMAGE]: 'image/',
};

// Mapping of MIME types to content descriptions
export const mimeTypeToComponent: MimeTypeToComponent = {
  [MimeTypes[SupportedFormat.IMAGE]]: (
    props: ComponentProps<{ alt?: string }>,
  ) => <Image src={props.src} alt={props.alt || props.src} />,
  [MimeTypes[SupportedFormat.PDF]]: (props: ComponentProps<object>) => (
    <span>PDF at {props.src}</span>
  ),
};

// Regex patterns for file extensions
export const fileExtensionRegex = {
  [SupportedFormat.IMAGE]: /\.(jpeg|jpg|gif|png|svg)(\?.*)?$/i,
  [SupportedFormat.PDF]: /\.pdf(\?.*)?$/i,
  [SupportedFormat.MARKDOWN]:
    /(\*\*|__|\*|_|~~|\[.*?\]\(.*?\)|<("[^"]*"|'[^']*'|[^'">])*>)/,
};
