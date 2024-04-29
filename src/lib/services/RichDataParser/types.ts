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
      type: SupportedFormat.PDF;
    }
  | {
      content: string;
      title: string;
      type: SupportedFormat.MARKDOWN;
    }
  | {
      startIndex: number;
      content: string[];
      type: SupportedFormat.IMAGE;
    };
