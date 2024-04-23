import { SupportedFormat } from './constants';

export type ComponentProps<T extends object> = T & {
  src: string;
};

export type MimeTypeToComponent = {
  [mimeType: string]: <T extends object>(
    props: ComponentProps<T>,
  ) => JSX.Element;
};

export type CurrentView =
  | {
      content: string;
      type: SupportedFormat.PDF | SupportedFormat.MARKDOWN;
    }
  | {
      content: string[];
      type: SupportedFormat.IMAGE;
    };
